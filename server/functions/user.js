const wechat = require('../wechat')
const MD5 = require('./crypto').getMD5
const util = require('./util')
const model = require('../model')

const user = {}

user.login = (code) => {
	// 登录
	// 未注册： 完成注册
	// 已注册： 更新相关鉴权加密参数
	// 返回用户信息
	return new Promise(async (resolve, reject) => {
		try{
			if(!code) throw 'code is not found'
			const session = await wechat.code2Session(code)
			const uniqueId = MD5(session.openid)
			let userinfo = await model.USER.findOne({
				uniqueId: uniqueId
			})
			if(!userinfo) userinfo = new model.USER({
		      "uniqueId": uniqueId
		    })
			userinfo = await userinfo.save()
			resolve(userinfo)
		}catch(error){
			reject(error)
		}
	})
}


module.exports = user