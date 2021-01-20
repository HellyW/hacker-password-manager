const CryptoJS = require('crypto-js')

const getMD5 = (str = '') => {
  return CryptoJS.MD5(CryptoJS.enc.Utf8.parse(str)).toString(CryptoJS.enc.Hex).toUpperCase()
}

class AES {
  constructor(key, vi) {
    this.key = CryptoJS.enc.Utf8.parse(getMD5(key))
    this.vi = CryptoJS.enc.Utf8.parse(getMD5(vi))
  }
  encrypt(plaintext = ''){
    let parseText = CryptoJS.enc.Utf8.parse(plaintext)
    let encrypted = CryptoJS.AES.encrypt(parseText, this.key, { iv: this.vi, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    return encrypted.ciphertext.toString().toUpperCase()
  }
  decrypt(encrypt_text = ''){
    let encryptedHexStr =  CryptoJS.enc.Hex.parse(encrypt_text)
    let stringifyText = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    let decrypt = CryptoJS.AES.decrypt(stringifyText, this.key, { iv: this.vi, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
  }
}

module.exports = {
  getMD5,
  AES
}