const mongoose = require('mongoose')
const util = require('../functions/util')
// 用户模型
const schema = mongoose.Schema({
  // 用户唯一标识 - 对openid做非对称加密
  uniqueId: {
    type: String,
    required: true,
    unique: true,
    index:true
  },
  // 用户资料 - 用于丰富显示场景
  userinfo: {
    nickName: String,
    avatarUrl: String,
    gender: String,
    country: String,
    province: String,
    city: String,
    language: String
  },
  // 身份认证信息
  session: {
    // 网络传输身份认证
    token: {
      type: String,
      unique: true,
      required: true,
      index:true
    },
    // 随机的加密因子
    vi: String,
    // token 过期时间
    expired: {
      type: Date,
      default: Date.now()
    }
  },
  // 创建时间
  createAt: {
    type: Date,
    default: Date.now()
  },
  // 更新时间
  updateAt: {
    type: Date,
    default: Date.now()
  }
})


schema.pre('validate', function(next){
  if(!this.session) this.session = {}
  if(!this.session.token) this.session.token = util.getUUID()
  if(!this.session.vi) this.session.vi = util.getRandomStr(24)
  next()
})

schema.pre('save', function(next) {
  if(this.isNew) this.createAt = Date.now() 
  this.updateAt = Date.now()
  if(!this.session) this.session = {}
  this.session.token = util.getUUID()
  this.session.vi = util.getRandomStr(24)
  this.session.expired = new Date(new Date().getTime() + 2 * 60 * 60 * 1000)  
  next()
})

module.exports = schema
