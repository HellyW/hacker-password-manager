const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 账号数据模型
const schema = mongoose.Schema({
  // 类别
  category: {
    type: Schema.Types.ObjectId,  
    ref: 'category',
    index: true
  },
  // 密钥
  qrkey: {
    type: Schema.Types.ObjectId,  
    ref: 'qrkey',
    required: true,
    index: true
  },
  // 别名
  name: String,
  // 用户名
  account: String,
  // 密码
  password: String,
  // 其余加密信息
  safeInfo: [{
    // 名称 - 不加密
    key: String,
    // 存值 - 加密
    value: String
  }],
  // 创建者
  owner: {
    type: Schema.Types.ObjectId,  
    ref: 'user',
    required: true,
    index: true
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

schema.pre('save', function(next) {
  if(this.isNew)  this.createAt = Date.now()
  this.updateAt = Date.now()
  next()
})


module.exports = schema
