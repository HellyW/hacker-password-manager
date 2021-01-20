const util = require("./util")
const CONFIG = require('../config')
const URIS = require('./urls')

const auth = {}

auth.code2Session = code => {
	return new Promise(async (resolve, reject) => {
		try{
			if(!code) throw 'code is not found'
			const ret = await util.request({
				uri: `${URIS.auth.code2Session}?appid=${CONFIG.app_id}&secret=${CONFIG.app_serect}&js_code=${code}&grant_type=authorization_code`
			}, false)
			resolve(ret)
		}catch(error){
			reject(error)
		}
	})
}


module.exports = auth