const ERR = require('../errCode')
const CONFIG = require('../config')
const retMsg = require('../functions/retMsg')

module.exports = (ret, req, res, next) => {
  const vi = req.operator && req.operator.session && req.operator.session.vi || CONFIG.api_vi_default_plain
  try{
    if(typeof ret === 'string' || ret instanceof Error) throw ret
    res.json(retMsg(0, ret, 'success', vi))
  }catch(error){
    const ERR_MESSAGE = error.message || error.error || error
    const ERR_KEY = ERR[ERR_MESSAGE] ? ERR_MESSAGE : 'UNKOWN_ERROR'
    res.json(retMsg(ERR[ERR_KEY], {}, ERR_MESSAGE || ERR_KEY, vi))
  }
}