// share.js
const router = require('express').Router()
const util = require('../functions/util')
const wechat = require('../wechat')
const model = require('../model')
const CONFIG = require('../config')

router.get('/:id',async (req, res, next) => {
	try{
		if(!req.operator) throw "NO_AUTH"
		const shareInfo = await model.SHARE.findOne({
			_id: req.params.id
		})
		if(!shareInfo) throw '没找到这个分享；美好的东西总是昙花一现、转瞬即逝！'
		if(new Date().getTime() >= new Date(shareInfo.expired).getTime()) throw '分享已经失效，再试也只是徒劳。'
		next({
			encryptStr: shareInfo.encryptStr
		})
	}catch(error){
		next(error)
	}
})

router.post('/', async (req, res, next) => {
	try{
		if(!req.operator) throw "NO_AUTH"
		const {
			name,
			encryptStr,
			isTemp
		} = req.body
		if(!name) throw '您必须指定一个别名'
		if(!encryptStr) throw '您必须指定需要分享的信息'
		try{
			await wechat.checkText(name)
		}catch(error){
			// 其他错误情况不管， 只在请求成功并且存在违禁词汇的时候做出拦截
			if(typeof error === 'string' && error.indexOf("risky content") !== -1) throw '存在违禁词汇，已被腾讯拦截'
		}
		const {
			_id: id,
			expired
		} = await new model.SHARE({
			name,
			encryptStr,
			expired: new Date(new Date().getTime() + ( (true || isTemp) ? 7 : 20 * 365 ) * 24 * 60 * 60 * 1000),
			owner: req.operator._id
		}).save()
		const path = await wechat.getWXAcodeUnlimit('account/pages/share', id)
		// 需要根据这个id 生成一个小程序码
		// 由前端生成一张分享海报
		next({
			path: path.replace("../uploads", 'upload'),
			expired
		})
	}catch(error){
		next(error)
	}
})

module.exports = router