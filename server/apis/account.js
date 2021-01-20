const router = require('express').Router()
const util = require('../functions/util')
const wechat = require('../wechat')
const model = require('../model')
const CONFIG = require('../config')
const AES = require('../functions/crypto').AES

// 获取账号详情
router.get('/:id', async (req, res, next) => {
  try{
    if(!req.params.id) throw '请指明需要查询的账号信息'
    const { code, qrkey } = req.query
    if(!code) throw "登录失败，身份丢失"
    if(!qrkey) throw "您必须指定合法的密钥串"
    // 准备相关参数
    const { openid } = await wechat.code2Session(code)
    const { pass } = await model.QRKEY.findOne({
      _id: qrkey
    })

    const account = await model.ACCOUNT.findOne({
      "_id": req.params.id,
      "owner": req.operator._id
    }).populate("category", {
      '_id': 0,
      'name': 1,
      'icon': 1,
      'website': 1
    })
    // 此处还需要对数据库存储的账号密码等敏感信息做解密操作
    // 解密
    const aes = new AES(`${CONFIG.db_key_plain}${pass}`, openid)
    account.password = aes.decrypt(account.password)
    account.safeInfo = account.safeInfo.map(v => {
      return {
        key: v.key,
        value: aes.decrypt(v.value)
      }
    })
    next(account || {})
  }catch(err){
    next(err)
  }
})


// 删除该账号
router.delete('/:id', async (req, res, next) => {
  try{
    if(!req.params.id) throw '请指明需要查询的账号信息'
    const { qrkey } = req.body
    if(!qrkey) throw "您必须指定合法的密钥串"
    const {
      ok
    } = await model.ACCOUNT.remove({
      "_id": req.params.id,
      "qrkey": qrkey,
      "owner": req.operator._id
    })
    next(ok === 1 ? {} : new Error('删除失败'))
  }catch(err){
    next(err)
  }
})



// 修改账号信息
router.put('/:id', async (req, res, next) => {
  try{
    if(!req.params.id) throw '请指明需要查询的账号信息'
    const {
      code,
      vaildKey,
      qrkey,
      category,
      name,
      account,
      password,
      safeInfo
    } = req.body
    if(!code) throw "登录失败，身份丢失"
    if(!vaildKey) throw '请验证原始绑定的密钥二维码文件'
    if(!qrkey) throw "您必须绑定一个有效的密钥串"
    if(!name) throw "您必须输入一个可被识读的账号名称"
    const originalAccount = await model.ACCOUNT.findOne({
      "_id": req.params.id,
      "owner": req.operator._id
    })
    if(!account) throw "您所操作的账号可能已被清除，请稍后重试"
    if(originalAccount.qrkey.toString() !== vaildKey) throw '您的密钥二维码不正确，请验证后修改'
    // 处理常规参数
    for(let key in originalAccount){
      if(key.indexOf('_') !== -1) continue
      if(req.body[key]) originalAccount[key] = req.body[key]
    }
    // 处理需要加密的参数
    // 准备加密参数
    const { openid } = await wechat.code2Session(code)
    const { pass } = await model.QRKEY.findOne({
      _id: qrkey
    })
    // 加密
    const aes = new AES(`${CONFIG.db_key_plain}${pass}`, openid)
    originalAccount.password = aes.encrypt(password)
    originalAccount.safeInfo = safeInfo.map(v => {
      return {
        key: v.key,
        value: aes.encrypt(v.value)
      }
    })

    const updateAccount = await originalAccount.save()
    next(updateAccount || {})
  }catch(err){
    next(err)
  }
})



// 获取账号密码列表
router.get('/', async (req, res, next) => {
  try{
    if(!req.operator) throw "NO_AUTH"
    const {
      filter,
      index,
      size
    } = req.query
    const dbFilter = {
      "name": new RegExp(`${filter}`, 'g'),
      "owner": req.operator._id
    }
    const count = await model.ACCOUNT.count(dbFilter)
    const accounts = await model.ACCOUNT.find(dbFilter)
                                        .populate("category", {
                                          '_id': 0,
                                          'name': 1,
                                          'icon': 1,
                                          'website': 1
                                        })
                                        .sort({"updateAt": -1})
                                        .skip(((index || 1) - 1) * (size || 20))
                                        .limit(size||20)

    next({
      accounts: accounts.map(v=>{
        return {
          id: v._id,
          name: v.name,
          qrkey: v.qrkey,
          category: v.category,
          createAt: v.createAt,
          updateAt: v.updateAt
        }
      }),
      count: count
    })
  }catch(err){
    next(err)
  }
})




// 创建一个账号密码
router.post('/', async (req, res, next) => {
  try{
    if(!req.operator) throw "NO_AUTH"
    let {
      code,
      category,
      qrkey,
      name,
      account,
      password,
      safeInfo
    } = req.body
    if(!code) throw "登录失败，身份丢失"
    if(!category) throw "请选择账号类型"
    if(!qrkey) throw "您必须绑定一个有效的密钥串"
    if(!name) throw "您必须输入一个可被识读的账号名称"
    // 准备加密参数
    const { openid } = await wechat.code2Session(code)
    const { pass } = await model.QRKEY.findOne({
      _id: qrkey
    })
    // 加密
    const aes = new AES(`${CONFIG.db_key_plain}${pass}`, openid)
    password = aes.encrypt(password)
    safeInfo = safeInfo.map(v => {
      return {
        key: v.key,
        value: aes.encrypt(v.value)
      }
    })
    // 保存账号信息
    await (new model.ACCOUNT({
      category,
      qrkey,
      name,
      account,
      password,
      safeInfo,
      owner: req.operator._id
    })).save()
    next({})
  }catch(err){
    next(err)
  }
})





module.exports = router