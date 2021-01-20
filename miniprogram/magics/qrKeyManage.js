// qrKeyManage.js
// 用于对密钥文件的加解密及校验操作
 import { AES } from  '../magics/crypto'
 import { zip } from '../magics/zip'
 import { key } from '../api/key'
 import CONFIG from '../config/index'

 export const keyRegex = new RegExp(/^QK%([A-Z0-9]*)%$/)
 // // 十六进制切割位 
 // const HexSplitCount = 13
 // // 二进制切割位 
 // const splitCount = 53

 const Zip = new zip()

// qr key manager

 export class QR_KM {
 	constructor(key, vi){
 		this.qr_key_auth_code = key
 		this.qr_key_auth_vi = vi
 	}
 	encrypt(params){
 		return new Promise(async (resolve, reject) => {
 			try {
 				if(!params || typeof params !== 'object') throw 'encrypt object is invaild'
		 		if(!this.qr_key_auth_code || !this.qr_key_auth_vi) throw 'encrypt args is missing '
		 		const qr_crypto_object_str = JSON.stringify(params)
		 		const aesA = new AES(this.qr_key_auth_code, this.qr_key_auth_vi)
		 		const qr_pass = aesA.encrypt(qr_crypto_object_str)
		 		const qr_key_object_str = JSON.stringify({
		 			"pass": qr_pass,
  					"code": this.qr_key_auth_code
		 		})
		 		const aesB = new AES(CONFIG.qr_key_plain, CONFIG.qr_vi_plain)
				 const qr_key = aesB.encrypt(qr_key_object_str)
				 
				//  做二维码密钥压缩

				const decode_qr_key = await Zip.compress(qr_key)
				
		 		resolve(`QK%${decode_qr_key}%`)

 			}catch(error){
 				reject(error)
 			}
 		})
 	}
 	decrypt(str){
 		return new Promise(async (resolve, reject) => {
 			try {
				 str = str.replace(keyRegex, '$1') || str

				 // 解压
				 str = await Zip.decompress(str)

				 if(!str || typeof str !== 'string') throw 'decrypt string is invaild'
		 		const aesA = new AES(CONFIG.qr_key_plain, CONFIG.qr_vi_plain)
		 		let qr_key_object = null
		 		try{
		 			const qr_key_object_str = aesA.decrypt(str)
		 			qr_key_object = JSON.parse(qr_key_object_str)
		 		}catch(error){
		 			throw '传入的密钥文件无法被正确解析[decrypt original data failed]'
		 		}
		 		this.qr_key_auth_code = qr_key_object.code
		 		const qr_pass = qr_key_object.pass
		 		if(!this.qr_key_auth_code) throw "密钥文件已被损坏[key missing]"
		 		if(!qr_pass) throw "密钥文件已被损坏[pass missing]"
		 		const decryptParmas = await key.getQR(this.qr_key_auth_code)
		 		this.qr_key_auth_vi = decryptParmas.qr_key_auth_vi
		 		if(!this.qr_key_auth_vi) throw "请扫描有效的合法密钥二维码"
		 		const aesB = new AES(this.qr_key_auth_code, this.qr_key_auth_vi)
		 		let qr_crypto_object = null
		 		try{
					const qr_crypto_object_str = aesB.decrypt(qr_pass)
		 			qr_crypto_object = JSON.parse(qr_crypto_object_str)
		 		}catch(error){
		 			throw '传入的密钥文件无法被正确解析[decrypt pass failed]'
		 		}
		 		resolve({
		 			...qr_crypto_object,
		 			qr_key_auth_code: this.qr_key_auth_code,
		 			qr_key_auth_vi: this.qr_key_auth_vi
		 		})
 			}catch(error){
 				reject(error)
 			}
 		})
 	}
 }