const config = {
  // 是否线上模式
  is_prod: (process.env.NODE_ENV || "DEV") === 'PROD',
  // 身份验证白名单
  auth_white_uris: [{
    method: new RegExp(/^POST$/, 'i'),
    uri: new RegExp(/\/user/)
  }]
}

module.exports = Object.assign({}, config, config.is_prod ? require('./config.prod.js') : require('./config.dev.js'))