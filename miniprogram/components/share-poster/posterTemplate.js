import { formatDate } from '../../magics/util'
const CONFIG = require("../../config/index")

export const getTemplate = (name, code, codeImg, expired) => {
	return {
      background: '#465773',
      width: '500rpx',
      height: '720rpx',
      views: [
        {
          type: 'text',
          text: `${name}`,
          css: {
            top: '30rpx',
            left: '250rpx',
            align: 'center',
            fontSize: '25rpx',
            color: '#FFFFFF',
            fontWeight: 800
          },
        },
        {
          type: 'text',
          text: `微信扫描下方小程序码，并输入访问码`,
          css: {
            top: '95rpx',
            left: '250rpx',
            align: 'center',
            fontSize: '20rpx',
            color: '#9DA9B5',
            fontWeight: 100
          },
        },
        {
          type: 'rect',
          css: {
            top: '140rpx',
            right: '50rpx',
            width: '400rpx',
            height: '400rpx',
            color: '#FFFFFF',
            borderRadius: '20rpx'
          },
        },
        {
          type: 'image',
          url: codeImg,
          css: {
            top: '190rpx',
            right: '125rpx',
            width: '250rpx',
            height: '250rpx'
          },
        },
        {
          type: 'text',
          text: `如需克隆，请在输入访问码后选择转存账号`,
          css: {
            top: '470rpx',
            left: '250rpx',
            align: 'center',
            fontSize: '16rpx',
            color: '#222222',
            fontWeight: 100
          },
        },
        {
          type: 'text',
          text: `访问码`,
          css: {
            top: '555rpx',
            left: '250rpx',
            align: 'center',
            fontSize: '20rpx',
            color: '#9DA9B5',
            fontWeight: 100
          },
        },
        {
          type: 'rect',
          css: {
            top: '590rpx',
            right: '110rpx',
            width: '260rpx',
            height: '60rpx',
            color: '#FFFFFF',
            borderRadius: '20rpx'
          },
        },
        {
          type: 'text',
          text: `${code.replace(/(\d)/g, ' $1 ')}`,
          css: {
            top: '600rpx',
            left: '260rpx',
            align: 'center',
            fontSize: '35rpx',
            color: '#4CAD44',
            fontWeight: 800
          },
        },
        {
          type: 'text',
          text: `该分享7天内有效，请于${formatDate(expired)}前查阅！`,
          css: {
            top: '665rpx',
            left: '250rpx',
            align: 'center',
            fontSize: '20rpx',
            color: '#9DA9B5',
            fontWeight: 100
          },
        }
      ]
    }
}