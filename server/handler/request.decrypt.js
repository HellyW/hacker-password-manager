const _ = require('underscore')
const AES = require('../functions/crypto').AES
const CONFIG = require('../config')
const wechat = require('../wechat')

const formatRequestData = (originalData = {}, decryptData = {}) => {
  return _.extend({}, CONFIG.is_prod ? {} : originalData , decryptData)
}

const decryptRequestData = (encryptFormData, vi = CONFIG.api_vi_default_plain) => {
  return new Promise((resolve, reject) => {
    try {
      let decryptData = {}
      if(encryptFormData && vi){
        const aes = new AES(CONFIG.api_key_plain, vi)
        try {
          decryptData = aes.decrypt(encryptFormData)
        } catch(e) {
          throw 'REQUEST_DATA_SIGN_ERR'
        }
        try{
          // 格式化
          if(typeof decryptData === 'string') decryptData = JSON.parse(decryptData)
        }catch(error){
          throw 'REQUEST_DATA_FORMAT_ERR'
        }
      }
      resolve(decryptData)
    } catch(e) {
      reject(e)
    }
  })
}

const _checkTextSafe = str => {
  return new Promise(async(resolve, reject) => {
    try {
      await wechat.checkText(str)
      resolve()
    } catch(e) {
      if(typeof e === 'string' && e.indexOf("risky content") !== -1) reject('存在违禁词汇，已被腾讯拦截')
      // 其他错误情况不管， 只在请求成功并且存在违禁词汇的时候做出拦截
      resolve()
    }
  })
}

const checkTextSafe = args => {
  return new Promise(async(resolve, reject) => {
    try {
      if(typeof args === 'string') await _checkTextSafe(args)
      for(let key in args) {
        await _checkTextSafe(args[key])
      }
      resolve()
    } catch(e) {
      reject(e)
    }
  })
}

module.exports = async (req, res, next) => {
  try{
    const vi = req.operator && req.operator.session && req.operator.session.vi || CONFIG.api_vi_default_plain
    // 目前仅仅body、query存在加密 params明文传递过来
    // 处理body
    const decryptBodyData = await decryptRequestData(req.body && req.body.encryptData, vi)
    req.body = formatRequestData(req.body, decryptBodyData)
    // 处理query
    const decryptQueryData = await decryptRequestData(req.query && req.query.encryptData, vi)
    req.query = formatRequestData(req.query, decryptQueryData)
    // 请求的文本安全， 暂时取消不做 [ 大量访问的数据都是密文内容  不适合做。 对外提供接口，由前端在必要的时机来处理 ]
    // await checkTextSafe(_.extend({}, decryptBodyData, decryptQueryData))

    next()
  }catch(err){
    next(err)
  }
}