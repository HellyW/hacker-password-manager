// qrKeyManage.js
// 用于对密钥文件的加解密及校验操作
import { AES } from  '../magics/crypto'
import { zip } from '../magics/zip'
import { key } from '../api/key'
import CONFIG from '../config/index'

export const keyRegex = new RegExp(/^QRK%([A-Z0-9]*)%$/)
// // 十六进制切割位 
// const HexSplitCount = 13
// // 二进制切割位 
// const splitCount = 53

 const Zip = new zip()

// qr recovery key manager

export class QR_RKM {
  constructor(key, vi){
    this.qr_recovery_key_auth_code = key
    this.qr_recovery_key_auth_pass = vi
  }
  encrypt(qrkey){
    return new Promise(async(resolve, reject) => {
      try {
        if(!qrkey) throw '请先输入密钥二维码'
        if(!this.qr_recovery_key_auth_code || !this.qr_recovery_key_auth_pass) throw 'encrypt args is missing '
         const aesA = new AES(this.qr_recovery_key_auth_code, CONFIG.qr_recovery_vi_plain)
        const qr_decrypt_key = aesA.encrypt(qrkey)
        const qr_recovery_key_object_str = JSON.stringify({
           "decryptKey": qr_decrypt_key,
           "recoveryPass": this.qr_recovery_key_auth_pass
        })
        const aesB = new AES(CONFIG.qr_recovery_key_plain, CONFIG.qr_recovery_vi_plain)
        const qr_recovery_key = aesB.encrypt(qr_recovery_key_object_str)

        // 压缩
        const decode_qrk = await Zip.compress(qr_recovery_key)

        resolve(`QRK%${decode_qrk}%`)
      }catch(error){
        reject(error)
      }
    })
  }
  decrypt(qrRecoveryKey){
    return new Promise(async (resolve, reject) => {
      try {
        qrRecoveryKey = qrRecoveryKey.replace(keyRegex, '$1') || qrRecoveryKey
        if(!qrRecoveryKey || typeof qrRecoveryKey !== 'string') throw 'decrypt string is invaild'
        
        qrRecoveryKey = await Zip.decompress(qrRecoveryKey)
        const aesA = new AES(CONFIG.qr_recovery_key_plain, CONFIG.qr_recovery_vi_plain)
        let qr_recovery_key_object = null
        try{
          const qr_recovery_key_str = aesA.decrypt(qrRecoveryKey)
          qr_recovery_key_object = JSON.parse(qr_recovery_key_str)
        }catch(error){
          throw '传入的备份密钥无法被正确解析[decrypt original data failed]'
        }
        this.qr_recovery_key_auth_pass = qr_recovery_key_object.recoveryPass
        const decryptKey = qr_recovery_key_object.decryptKey
        if(!this.qr_recovery_key_auth_pass) throw "备份密钥文件已被损坏[key missing]"
        if(!decryptKey) throw "备份密钥文件已被损坏[pass missing]"
        const decryptParmas = await key.getRcQR(this.qr_recovery_key_auth_pass)
        this.qr_recovery_key_auth_code = decryptParmas.qr_recovery_key_auth_code
        if(!this.qr_recovery_key_auth_code) throw "服务端有点小问题，请稍后重试"
        const aesB = new AES(this.qr_recovery_key_auth_code, CONFIG.qr_recovery_vi_plain)
        let qr_key = null
        try{
          qr_key = aesB.decrypt(decryptKey)
        }catch(error){
          throw '传入的密钥文件无法被正确解析[decrypt pass failed]'
        }
        resolve(qr_key)
      }catch(error){
        reject(error)
      }
    })
  }
}