const CONFIG = require('../config')
const AES = require('./crypto').AES
const util = require('./util')

module.exports = (code = 0, data = {}, message = 'success', vi = "") => {
  let retStr = null
  try{
    // 数据格式化
    retStr = typeof data === 'object' ? JSON.stringify(data || {}) : data
  }catch(error){
    console.error(error)
  }
  let encryptData = null
  if(retStr) {
    // 加密该字符串
    const aes = new AES(CONFIG.api_key_plain, vi)
    retStr = aes.encrypt(retStr)
    encryptData = util.base64Encode(retStr)
  }
  return {
    code,
    message,
    success: !code,
    encryptData,
    ...(CONFIG.is_prod ? {} : {
      decryptData: data,
      vi
    })
  }
}