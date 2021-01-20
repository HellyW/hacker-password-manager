const uuid = require('uuid')

const util = {}

const objectIdRegx = new RegExp(/^\w{24}$/)
const charsets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_"

util.getUUID = () => {
  return uuid.v4().replace(/\-/g, '').toLowerCase()
}

util.getRandomStr = (len = 10) => {
  let randomStr = ""
  for (var i = 0; i < len; i++) {
    randomStr += charsets.charAt(Math.floor(Math.random() * charsets.length))
  }
  return randomStr
}

util.base64Encode = str => {
  return new Buffer(str).toString('base64')
}

util.base64Decode = str => {
  return new Buffer(str, 'base64').toString('utf-8')
}


util.isObjectId = id => {
	return objectIdRegx.test(id)
}

module.exports = util