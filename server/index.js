// npm引入
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
// 本地服务引入
const CONFIG = require('./config')
const model = require('./model')


// 连接数据库
mongoose.connect(CONFIG.db_connect)
const db = mongoose.connection
db.on('connected', () => {
  console.info(`[db] connected to db [${CONFIG.db_connect}]`)
})
  // 监听数据库连接错误
db.on('error', error => {
  throw error
})

// 创建express服务
const app = new express()
// 启动express服务
app.listen(CONFIG.port, ()=>{
  console.info(`[express] server start on port [ ${CONFIG.port} ]`)
})
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
    // parse application/json
app.use(bodyParser.json())

app.use('/upload',(req, res, next) => {
  const fileDir = path.join(__dirname, `./uploads/`)
  fs.existsSync(fileDir) || fs.mkdirSync(fileDir)
  next()
} ,express.static('./uploads'))

// 接口服务

  // 身份验证： 验证请求者的合法性
app.use((require('./handler/request.auth')))

// 文件上传api
app.post('/upload', require('./handler/request.file'))


  // 解密请求： 请求数据的合法性
app.use((require('./handler/request.decrypt')))

  // 日志装载： 记录相关日志信息

  // 挂载服务 :  api服务
app.use('/api', require('./apis'))

  // 404
app.use((req, res, next) => {
  throw 'NOT_FOUND'
})
  // 加密响应及其他错误监听
app.use(require('./handler/response'))
