/**
 * @name: ajax.js
 * @version: 1.0.0
 * @description: 为项目适配，对mp-axios做进一步定制化使用; 可以当做mp-axios的用例来做
 * @author: HellyW
 * @extends: mp-axios.js
 */
 import { AES, base64Decode } from  '../magics/crypto'
 import { mp_axios, METHODS } from './libs/mp-axios'
 import { user } from '../api/user'
 import CONFIG from '../config/index'

 const isRelease = CONFIG.envVersion === 'release'

 const request = {}

 const mpAxios = new mp_axios({
  host: CONFIG.API_PATH || ""
 })

 const isApiWhite = (url, method) => {
  const whites = CONFIG.auth_white_uris.filter(v=>{
    return v.method.test(method.toUpperCase()) && v.uri.test(url)
  })
  return !!whites.length
 }

 const getCrypto = config => {
  const session = wx.getStorageSync(CONFIG.SESSION_STORAGE_KEY)
  // 白名单内请求清单不校验token， 加解密则使用默认vi
  const vi = isApiWhite(config.url, config.method) ? CONFIG.api_vi_default_plain : (session && session.vi) ||  CONFIG.api_vi_default_plain
  return new AES(CONFIG.api_key_plain, vi)
 }

// 对request做处理
mpAxios.interceptors.request(config => {
  const session = wx.getStorageSync(CONFIG.SESSION_STORAGE_KEY)
  // 此处传递请求的身份认证参数
  if(session.token) config.header["token"] = session.token  
  // 此处对发起请求的参数做加密处理
  const aes = getCrypto(config)
  config.data = {
    ...(isRelease ? {} : config.data),
    encryptData: aes.encrypt(JSON.stringify(config.data || {}))
  }
  return config
})
// 对response做处理
mpAxios.interceptors.response((response, config) => {
  try{
    if(response.statusCode !== CONFIG.NETWORK_SUCCESS_CODE) throw `网络异常，请检查网络连接是否正常[${response.statusCode || response.errMsg}]`
    let data = response.data
    try{
      if(typeof data === 'string') data = JSON.parse(data) || {}  
    }catch(err){
      throw '返回的响应参数不是有效的json格式，请稍后重试'
    }
    if(!response.success && data.code !== CONFIG.API_SUCCESS_CODE) throw data
    // 所有响应验证正确，此处开始对返回的参数做解密操作
    const aes = getCrypto(config)
    let decryptData
    try {
      if(data.encryptData) decryptData = JSON.parse(aes.decrypt(base64Decode(data.encryptData)))
      return Promise.resolve(decryptData)
    } catch (error) {
      console.log(error)
      throw new Error("未能成功解析相应数据，请重新进入小程序再试")
    }
  }catch(err){
    return Promise.reject(err)
  }
})

 METHODS.forEach(METHOD => {
  request[METHOD.toLowerCase()] = (url, data = {}, opts = {}) => {
    return new Promise(async (resolve, reject) => {
      try{
        // 请求前检查session是否有效
        const session = wx.getStorageSync(CONFIG.SESSION_STORAGE_KEY)
        if((!session.token || new Date(session.expired).getTime() < new Date().getTime()) && !isApiWhite(url, METHOD)) {
          try{
            await user.login()
          }catch(error){
            console.error(error)
          }
        }
        resolve(await mpAxios.request(Object.assign({}, {
          method: METHOD.toUpperCase(),
          url: url,
          data: data
        }, opts)))
      }catch(err){
        if(CONFIG.RELOGIN_CODE.test(err.code)) wx.clearStorageSync(CONFIG.SESSION_STORAGE_KEY)
        err = err.message || err.message || err
        reject(err)
      }
    })
  }
 })


 module.exports = request