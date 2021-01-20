// secCheck.js
const util = require("./util")
const CONFIG = require('../config')
const URIS = require('./urls')

const secCheck = {}

secCheck.checkImage = image => {
	return new Promise(async (resolve, reject) => {
		try{
			if(!image) throw 'image is not found'
			const ret = await util.request({
				method: 'POST',
				uri: `${URIS.secCheck.imageCheck}`,
				json: false,
				formData: {
					buffer: {
						value: image,
					    options: {
					      filename: '1.png',
					      contentType: 'image/png'
					    }
					}
				}
			})
			resolve(ret)
		}catch(error){
			reject(error)
		}
	})
}


secCheck.checkText = str => {
	return new Promise(async (resolve, reject) => {
		try{
			if(!str || typeof str !== 'string') return resolve()
			const ret = await util.request({
				method: 'POST',
				uri: `${URIS.secCheck.stringCheck}`,
				body: {
					content: str
				}
			})
		console.log(`文字${str}的检查结果为：`, ret)
			resolve(ret)
		}catch(error){
			reject(error)
		}
	})
}


module.exports = secCheck