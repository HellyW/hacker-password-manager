const router = require('express').Router()
const util = require('../functions/util')
const model = require('../model')

// 创建恢复密钥串合法识别码
router.post('/recovery', async (req, res, next) => {
  try{
    if(!req.operator) throw "NO_AUTH"
    const {
    	code: qr_recovery_key_auth_code,
    	_id: qr_recovery_key_auth_pass
    } = await (new model.RECOVERY({
    	owner: req.operator._id
    })).save()
    next({
    	qr_recovery_key_auth_code,
    	qr_recovery_key_auth_pass
    })
  }catch(err){
    next(err)
  }
})


// 获取恢复密钥串合法识别码
router.get('/recovery', async (req, res, next) => {
  try{
    if(!req.operator) throw "NO_AUTH"
    if(!req.query.pass) throw "缺少恢复密钥的认证"
    const {
    	code: qr_recovery_key_auth_code,
    	_id: qr_recovery_key_auth_pass
    } = await  model.RECOVERY.findOne({
    	_id: req.query.pass,
    	owner: req.operator._id
    }) || {}
    next({
    	qr_recovery_key_auth_code,
    	qr_recovery_key_auth_pass
    })
  }catch(err){
    next(err)
  }
})


// 创建密钥串合法识别码
router.post('/qr', async (req, res, next) => {
  try{
    if(!req.operator) throw "NO_AUTH"
    const {
    	vi: qr_key_auth_vi,
    	_id: qr_key_auth_code
    } = await (new model.QRKEY({
    	owner: req.operator._id
    })).save()
    next({
    	qr_key_auth_code,
    	qr_key_auth_vi
    })
  }catch(err){
    next(err)
  }
})


// 获取密钥串合法识别码
router.get('/qr', async (req, res, next) => {
  try{
    if(!req.operator) throw "NO_AUTH"
    if(!req.query.code) throw "缺少密钥的认证"
    const {
    	vi: qr_key_auth_vi,
    	_id: qr_key_auth_code
    } = await model.QRKEY.findOne({
    	_id: req.query.code,
    	owner: req.operator._id
    }) || {}
    next({
    	qr_key_auth_code,
    	qr_key_auth_vi
    })
  }catch(err){
    next(err)
  }
})

module.exports = router