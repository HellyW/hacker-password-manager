const mongoose = require('mongoose')
const Schema = mongoose.Schema
const util = require('../functions/util')
//  share 分享模型
const schema = mongoose.Schema({
  // 别名
  name: {
    type: String,
    required: true
  },
  // 加密后的字符串
  encryptStr: {
    type: String,
    required: true
  },
  expired: {
    type: Date,
    default: Date.now()
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


schema.pre('save', function(next) {
  this.createAt = Date.now()
  if(!this.expired) this.expired = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) 
  next()
})


module.exports = schema
