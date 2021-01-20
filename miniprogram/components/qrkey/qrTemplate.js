
const CONFIG = require("../../config/index")

export const getTemplate = (key, code) => {
	return {
      background: '#F0F2F6',
      width: '500rpx',
      height: '650rpx',
      borderRadius: '20rpx',
      views: [
        {
          type: 'text',
          text: `微信搜索“${CONFIG.APP_NAME}”`,
          css: {
            top: '30rpx',
            left: '250rpx',
            align: 'center',
            fontSize: '25rpx',
            color: '#9DA9B5',
            fontWeight: 300
          },
        },
        {
          type: 'text',
          text: `标识头： ${key.substr(0, 20)}……`,
          css: {
            top: '75rpx',
            left: '250rpx',
            align: 'center',
            fontSize: '20rpx',
            color: '#9DA9B5',
            fontWeight: 100
          },
        },
        {
          type: 'qrcode',
          content: key,
          css: {
            top: '100rpx',
            right: '50rpx',
            width: '400rpx',
            height: '400rpx',
          },
        },
        {
          type: 'text',
          text: `标识尾： ……${key.substr(key.length - 20, 20)}`,
          css: {
            top: '500rpx',
            left: '250rpx',
            align: 'center',
            fontSize: '20rpx',
            color: '#9DA9B5',
            fontWeight: 100
          },
        },
        {
          type: 'text',
          text: `${code.replace(/^(\w{5}).*(\w{6})$/, "0x$1****$2")}`,
          css: {
            top: '550rpx',
            left: '250rpx',
            align: 'center',
            fontSize: '30rpx',
            fontWeight: 700
          },
        },
        {
          type: 'text',
          text: "密钥文件  妥善保管  丢失无法找回",
          css: {
            bottom: '30rpx',
            left: '250rpx',
            align: 'center',
            fontSize: '25rpx',
            color: '#9DA9B5',
            fontWeight: 300
          },
        }
      ]
    }
}