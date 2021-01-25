// urls.js
// 微信请求地址 - 不需要变动的固定参数
const host = "https://api.weixin.qq.com"
const defaultApiPath = "/cgi-bin"

const getFullPath = (url, apiPath = defaultApiPath) => {
	return `${host}${apiPath}${url}`
}

module.exports = {
	auth: {
		code2Session: getFullPath("/jscode2session", "/sns"),
		getPaidUnionId: getFullPath("/getpaidunionid", "/wxa"),
		getAccessToken: getFullPath("/token")
	},
	wxacode: {
		getUnlimit: getFullPath("/getwxacodeunlimit", "/wxa")
	},
	secCheck: {
		imageCheck: getFullPath("/img_sec_check", "/wxa"),
		stringCheck: getFullPath("/msg_sec_check", "/wxa"),
	},
	trialfn: {
		bindTester: getFullPath("/bind_tester", "/wxa"),
		unbindTester: getFullPath("/unbind_tester", "/wxa"),
		getTrialQRcode: getFullPath("/get_qrcode", "/wxa"),
	}
}