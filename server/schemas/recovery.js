const mongoose = require('mongoose')
const Schema = mongoose.Schema
const util = require('../functions/util')
// 恢复密钥模型
const schema = mongoose.Schema({
  // 加密参数
  // _id 用作pass； 这源于前期设计上的问题
  code: {
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
  if(!this.code) this.code = util.getRandomStr(24)
  next()
})

schema.pre('findOne', function(next) {
  try{
    if(this._conditions._id && !util.isObjectId(this._conditions._id)) throw "请传入正确的恢复密钥认证数据"
    if(this._conditions.owner && !util.isObjectId(this._conditions.owner)) throw "AUTH_INVAILD"
    next()
  }catch(err){
    console.log(err)
    next(err)
  }  
})

schema.pre('save', function(next) {
  if(!this.code) this.code = util.getRandomStr(24)
  this.createAt = Date.now()
  next()
})


module.exports = schema
