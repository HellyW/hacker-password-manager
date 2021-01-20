const router = require('express').Router()
const util = require('../functions/util')
const model = require('../model')
const user = require('../functions/user')

// 获取用户基本资料
router.get('/', (req, res, next) => {
  try{
    if(!req.operator) throw "NO_AUTH"
    const { userinfo } = req.operator
    next(userinfo)
  }catch(err){
    next(err)
  }
})

// 注册
router.post('/', async (req, res, next) => {
  try{
    if(!req.body.code) throw '缺少登录参数js_code'
    const {
      session
    } = await user.login(req.body.code)
    next(session)
  }catch(err){
    next(err)
  }
})

// 更新用户资料
router.put('/', async (req, res, next) => {
  try{
    if(!req.operator) throw "NO_AUTH"
    const {
      nickName,
      avatarUrl,
      gender,
      country,
      province,
      city,
      language
    } = req.body
    const ret = await model.USER.update({
      _id: req.operator._id
    }, {
      "$set": {
        "userinfo": {
          nickName,
          avatarUrl,
          gender,
          country,
          province,
          city,
          language
        }
      }
    })
    if(!ret.ok) throw '更新失败'
    const user = await model.USER.findOne({
      _id: req.operator._id
    })
    next(user)
  }catch(err){
    next(err)
  }
})


// 注销操作
// 后面来实现： 需要联多张表进行删除
router.delete('/',async (req, res, next) => {
  try{
    const {
      _id: id
    } = req.operator
    if(!id) throw "NO_AUTH"
    // 逐张表开始删除
    // 分享表
    await model.SHARE.remove({ 'owner': id })
    // 备份密钥表
    await model.RECOVERY.remove({ 'owner': id })
    // 密钥表
    await model.QRKEY.remove({ 'owner': id })
    // 账号表
    await model.ACCOUNT.remove({ 'owner': id })
    // 账号类型表  已被征集为共用的保留
    await model.CATEGORY.remove({ 'owner': id , 'public': false })
    // 删除用户表
    await model.USER.remove({ '_id': id })
    next({})
  }catch(error){
    next(err)
  }
})


module.exports = router