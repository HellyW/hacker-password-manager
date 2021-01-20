// account/pages/share.js
import { AES, base64Decode } from  "../../magics/crypto"
 import CONFIG from '../../config/index'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    encryptStr: null,
    decrypting: false,
    decryptObj: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEncryptStr(options.scene)
  },

  async getEncryptStr(id){
    let self = this
    try{
      if(!id) throw '未能成功识别该码，请扫描正确小程序码'
      const {
        encryptStr
      } = await app.$api.share.getShare(id)
      this.setData({
        encryptStr: encryptStr
      })
    }catch(error){
      wx.showModal({
        showCancel: false,
        title: '处理失败',
        content: error,
        confirmText: '回到首页',
        success(){
          self.toHome()
        }
      })
    }
  },

  toHome(){
    wx.reLaunch({
      url: '/pages/home/list'
    })
  },

  async saveShareAccount(){
    try{
      const  {eventChannel} = await wx.navigateTo({
        url: "/pages/home/add"
      })
      eventChannel.emit('copyAccount', this.data.decryptObj)
    }catch(error){
      app.$toast(error)
    }
  },

  decryptAccount({ detail }){
    try{
      this.setData({ decrypting: true })
      const { code } = detail.value
      if(!code) throw '请输入访问码'
      const aes = new AES(CONFIG.share_key_plain, code)
      let decryptObj = null
      try{
        decryptObj = aes.decrypt(this.data.encryptStr)
        decryptObj = base64Decode(decryptObj)
        decryptObj = JSON.parse(decryptObj)
      }catch(error){
        console.log(error)
        throw '解密失败，请确认您的访问码是否正确'
      }
      this.setData({ decryptObj: decryptObj, decrypting: false })
    }catch(error){
      this.setData({ decrypting: false })
      app.$toast(error)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})