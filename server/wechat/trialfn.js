// trialfn.js
// 体验版相关能力
// 可能无法使用，此处先做开发测试
const util = require('../functions/util')
const wechatUtil = require('./util')

const CONFIG = require('../config')
const URIS = require('./urls')

const trialfn = {}


trialfn.bindTester = wechatid => {
  // 绑定成为开发者
  return new Promise(async (resolve, reject) => {
    try{
      if(!wechatid || typeof wechatid !== 'string') throw "请传入微信号"
      const ret = await wechatUtil.request({
        method: 'POST',
        uri: `${URIS.trialfn.bindTester}`,
        body: {
          wechatid
        }
      })
      resolve(ret.userstr)
    }catch(error){
      reject(error)
    }
  })
}

trialfn.unbindTester = userstr => {
  // 解绑开发者
  return new Promise(async (resolve, reject) => {
    try{
      if(!userstr || typeof userstr !== 'string') throw "解绑失败，没有获取有效的参数"
      await wechatUtil.request({
        method: 'POST',
        uri: `${URIS.trialfn.unbindTester}`,
        body: {
          userstr
        }
      })
      resolve()
    }catch(error){
      reject(error)
    }
  })
}


trialfn.getTrialQRcode = path => {
  // 获取体验版二维码
  return new Promise(async (resolve, reject) => {
    try{
      if(!path) throw "获取体验版二维码失败，请稍后重试"
      const accessToken = await wechatUtil.getAccessToken()
      const path = await util.downloadImage(`${URIS.trialfn.getTrialQRcode}?access_token=${accessToken}&path=${path}`)
      resolve(path)
    }catch(error){
      reject(error)
    }
  })
}



module.exports = trialfn