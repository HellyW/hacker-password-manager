
// 提供微信的请求服务。内部完成access_token的维护

const _ = require('underscore')
const request = require('request')
const path = require('path')
const fs = require('fs')

const CONFIG = require('../config')
const URIS = require('./urls')

const acFilePath = path.join(__dirname, './ac.txt')

const _request = (config = {}) => {
	// request promise 化
	return new Promise((resolve, reject) => {
		try{
			request(config, (error, response, ret) => {
				try{
					if(error) throw error
					if(response.statusCode !== 200) throw 'weixin network error'
					try{
						if(typeof ret === 'string') ret = JSON.parse(ret)
					}catch(error){
						console.error(error)
					}
					resolve(ret)
				}catch(error){
					reject(error)
				}
			})
		}catch(error){
			reject(error)
		}
	})
}

const refreshAccessToken = () => {
	return new Promise(async (resolve, reject) => {
		try{
			const ret = await _request({
				uri: `${URIS.auth.getAccessToken}?grant_type=client_credential&appid=${CONFIG.app_id}&secret=${CONFIG.app_serect}`
			})
			if(ret.errcode) return reject(ret.errmsg)
			// 保存access_token 至本地
			fs.writeFileSync(acFilePath, JSON.stringify({
				access_token: ret.access_token,
				expired: new Date(new Date().getTime() + ret.expires_in * 1000)
			}), 'utf-8') 
			resolve(ret.access_token)
		}catch(error){
			reject(error)
		}
	})
}

const getAccessToken = () => {
	return new Promise(async (resolve, reject) => {
		try{
			try{
				// 从本地获取access_token
				if(!fs.existsSync(acFilePath)) throw 'file not exist'
				let accessTokenObj = fs.readFileSync(acFilePath, 'utf-8')
				if(!accessTokenObj || accessTokenObj.trim().length === 0) throw 'local access_token file is not empty'
				if(typeof accessTokenObj === 'string') accessTokenObj = JSON.parse(accessTokenObj)
				if(!accessTokenObj.access_token) throw 'local access_token is not found'
				if(new Date().getTime() >= new Date(accessTokenObj.expired).getTime()) throw 'local access_token is expired'
				resolve(accessTokenObj.access_token)
			}catch(error){
				console.log('[get local access_token failed]', error)
				// 本地获取失败,尝试从互联网获取最新的access_token
				const accessToken = await refreshAccessToken()
				resolve(accessToken)
			}
		}catch(error){
			reject(error)
		}
	})
}

// isAc: 是否需要access_token
const wechatRequest = (config = {}, isAc = true) => {
	return new Promise(async (resolve, reject) => {
		try{
			const _config = _.extend({}, {
				method: 'GET',
				json: true
			}, config)
			if(!_config.uri) throw 'uri is required'
			if(isAc) {
				const accessToken = await getAccessToken()
				_config.uri += `${_config.uri.indexOf('?') === -1 ? '?' : '&'}access_token=${accessToken}`
			}
			const ret = await _request(_config)
			if(!ret.errcode) return resolve(ret)
			if(!isAc) return reject(ret.errmsg)
			if(ret.errcode !== 40014) return reject(ret.errmsg)
			// access_token 过期需要更新
			await refreshAccessToken()
			resolve(await wechatRequest(config), isAc)
		}catch(error){
			console.log(error)
			reject(error)
		}
	})
}

module.exports = {
	request: wechatRequest,
	getAccessToken
}