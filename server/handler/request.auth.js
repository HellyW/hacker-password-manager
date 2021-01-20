const model = require('../model')
const CONFIG = require('../config')

module.exports = async (req, res, next) => {
  try{
    // 白名单
    if(CONFIG.auth_white_uris.filter(v => {
      return v.method.test(req.method.toUpperCase()) && v.uri.test(req.originalUrl)
    }).length) return next()
    const sessionToken = req.headers["token"]
    if(!sessionToken) throw "TOKEN_MISSING"
    // const users = await model.USER.find({})
    // console.log(users)
    const user = await model.USER.findOne({
      "session.token": sessionToken
    })
    if(!user) throw 'AUTH_INVAILD'
    if(new Date().getTime() >= new Date(user.session.expired).getTime()) throw 'AUTH_EXPIRED'
    req.operator = user
    next()
  }catch(err){
    next(err)
  }
}