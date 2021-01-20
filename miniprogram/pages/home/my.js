// pages/home/my.js
const app = getApp()

const ENV_CN = {
  develop: '开发版，如有问题请提issue',
  trial: '内测版本，如有问题请联系开发者',
  release: '正式版'
}

Page({
  data: {
    killAllMask: false,
    exitMask: false,
    version: null
  },
  onLoad(options) {
    this.getUserinfo()
  },
  onReady(){
    const {
      miniProgram
    } = wx.getAccountInfoSync()
    this.setData({
      version: miniProgram.version || ENV_CN[miniProgram.envVersion]
    })
  },
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  tucao() {
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      extraData: {
        id: '137031'
      }
    })
  },
  async getUserinfo() {
    try {
      const userinfo = await app.$api.user.getUserinfo()
      console.log(userinfo)
    } catch (error) {

    }
  },
  showKillAllMask() {
    this.setData({
      killAllMask: true
    })
  },
  closeKillAllMask() {
    this.setData({
      killAllMask: false
    })
  },
  async removeAll(){
    try{
      await app.$api.user.suicide()
      this.setData({
        killAllMask: false,
        exitMask: true
      })
    }catch(error){
      app.$toast(error)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().$shareAppMessage()
  }
})