const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 账户类型模型
const schema = mongoose.Schema({
  // 图标
  icon: {
    type: String,
    required: true
  },
  // 名称  如：微信、QQ
  name: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  website: String,
  // 是否公开
  public: {
    type: Boolean,
    default: false
  },
  // 权重
  weight: {
    type: Number,
    default: 0
  },
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
  }
})

schema.pre('save', function(next) {
  this.createAt = Date.now()
  next()
})


module.exports = schema
