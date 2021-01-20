const mongoose = require('mongoose')
const Schema = mongoose.Schema
const util = require('../functions/util')
// 密钥模型
const schema = mongoose.Schema({
  // 加密参数
  // _id: 用作code  这是设计上code唯一性的要求
  pass: {
    type: String,
    required: true
  },
  vi: {
    type: String,
    required: true
  },
  // 创建者
  owner: {
    type: Schema.Types.ObjectId,  
    ref: 'user',
    required: true,
    index: true
  },
  createAt: {
    type: Date,
    default: Date.now()
  }
})

schema.pre('validate', function(next){
  if(!this.pass) this.pass = util.getRandomStr(24)
  if(!this.vi) this.vi = util.getRandomStr(18)
  next()
})

schema.pre('findOne', function(next) {
  try{
    if(this._conditions._id && !util.isObjectId(this._conditions._id)) throw "请传入正确的密钥认证数据"
    if(this._conditions.owner && !util.isObjectId(this._conditions.owner)) throw "AUTH_INVAILD"
    next()
  }catch(err){
    console.log(err)
    next(err)
  }  
})

schema.pre('save', function(next) {
  if(!this.pass) this.pass = util.getRandomStr(24)
  if(!this.vi) this.vi = util.getRandomStr(18)
  this.createAt = Date.now()
  next()
})


module.exports = schema
