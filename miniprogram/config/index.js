const envVersion = wx.getAccountInfoSync().miniProgram.envVersion

// const ENV_CONFIG = {
//   develop: require('./config.develop.js'),
//   trial: require('./config.trial.js'),
//   release: require('./config.release.js')
// }

// 目前将体验版和正式版共用一套环境

const ENV_CONFIG = {
  develop: require('./config.develop.js'),
  trial: require('./config.release.js'),
  release: require('./config.release.js')
}

// 通用配置
const CONFIG = {
  envVersion,
  NETWORK_SUCCESS_CODE: 200,
  API_SUCCESS_CODE: 0,
  RELOGIN_CODE: new RegExp(/^12\d*$/),
  APP_NAME: 'Hacker密码',
  // 身份验证白名单
  auth_white_uris: [{
    method: new RegExp(/^POST$/, 'i'),
    uri: new RegExp(/.*\/user/)
  }]
}


module.exports = Object.assign({}, CONFIG, ENV_CONFIG[envVersion])