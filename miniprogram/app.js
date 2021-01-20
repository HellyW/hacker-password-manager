//app.js
import api from './api/index'
import CONFIG from './config/index'
import { checkUpdate } from './magics/updateManager'
App({
  $api: api,
  $config: CONFIG,
  $toast(desc){
    if(!desc || typeof desc !== 'string') {
      console.log(desc)
      desc = desc && (desc.errMsg || desc.message ) || '系统异常，请稍后重试'
    }
  	wx.showToast({
      title: desc,
      icon: 'none',
      duration: 2000 + desc.length * 100
  	})
  },
  $shareAppMessage(){
    return {
      title: '都2023年了，怎么还在用密码去保护和管理一堆密码。',
      path: '/pages/home/list',
      imageUrl: '/assets/share.jpg'
    }
  },
  onLaunch(){
  },
  onShow(){
    // 版本检测
    checkUpdate(true)
  }
})