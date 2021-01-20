// request.file.js
// 处理文件上传服务 + 图片安全风险过滤
const path = require('path')
const fs = require('fs')
const multer=require('multer')
const util = require('../functions/util')

const wechat = require('../wechat')
// 图片上传服务

// 文件存储服务
const destination = (req, file, cb) => {
  try{
    // 指定存储位置
    const relativeFilePath = `./uploads/${new Date().getFullYear()}/`
    const filePath = path.join(__dirname, '../', relativeFilePath)
    fs.existsSync(filePath) || fs.mkdirSync(filePath)
    cb(null, relativeFilePath)
  }catch(error){
    console.log(error)
    cb(error)
  }
}

const storage = multer.diskStorage({
  destination: destination,
  filename: function (req, file, cb) {
    cb(null, `${util.getUUID()}${file.originalname.replace(/^.*(\..*)$/, "$1")}`)
  }
})

// 文件过滤器
const fileFilter = (req, file, cb) => {
  try{
    // 拒绝这个文件
    if(file.mimetype.indexOf('image') === -1) return cb(null, false)
    // 接收这个文件
    cb(null, true)
  }catch(error){
    cb(error)
  }
}

// 文件上传控制器
const uploadMulter = multer({ storage: storage, fileFilter: fileFilter, limits: {
  fileSize: 5 * 1024 * 1024
} }).single("picture")

module.exports = (req, res, next) => {
  uploadMulter(req, res,async err => {
    try{
      if (err instanceof multer.MulterError) throw `文件上传失败[${err.message || err}]`
      if (err) throw err
      try{
        // 此处需要调用腾讯图片审核接口，对上传图片进行风险过滤
        await wechat.checkImage(fs.readFileSync(path.join((__dirname, '../', req.file.path))))
      }catch(error){
        if(typeof error === 'string' && error.indexOf("risky content") !== -1 ) throw '图片存在敏感内容，请更换一张再试试哦~'
        // 其余处理失败的情况下，默认放行，不影响业务的处理
        console.error('微信图片安全检查接口处理失败： ', error)
      }
      // 文件上传成功
      next({
        path: req.file.path.replace(/uploads/, 'upload'),
        size: req.file.size
      })
    }catch(error){
      next(error)
    }
  })
}