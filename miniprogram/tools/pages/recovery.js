// tools/pages/recovery.js
import { QR_RKM } from '../../magics/qrRecoveryKeyManage'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrRecoveryScanMask: false,
    qrRecoveryMask: false,
    qrKeyMask: false,
    qrRecoveryKey: null,
    qrkey: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  closeQrRecoveryScanMask(){
    this.setData({
      qrRecoveryScanMask: false
    })
  },

  showQrRecoveryScanMask(){
    this.setData({
      qrRecoveryScanMask: true
    })
  },

  closeQrRecoveryMask(){
    this.setData({
      qrRecoveryMask: false
    })
  },

  closeQrKeyMask(){
    this.setData({
      qrKeyMask: false
    })
  },


  async getQrkeyEvent({detail}){
    try{
      const qrkey = detail.qrkey
      if(!qrkey) throw '未能获取有效的数码，请您稍后再试'
      const {
        qr_recovery_key_auth_code,
        qr_recovery_key_auth_pass
      } = await app.$api.key.createRcQR()
      if(!qr_recovery_key_auth_code || !qr_recovery_key_auth_pass) throw '创建备份密钥失败，请稍后重试'
      const qrRkm = new QR_RKM(qr_recovery_key_auth_code, qr_recovery_key_auth_pass)
      const qrRecoveryKey = await qrRkm.encrypt(qrkey)
      this.setData({
        qrRecoveryScanMask: false,
        qrRecoveryKey: qrRecoveryKey,
        qrRecoveryMask: true
      })
    }catch(error){
      app.$toast(error)
    }
  },

  async restore(){
    try {
      const {
        data
      } = await wx.getClipboardData({})
      if(!data) throw  '请先复制您的备份密钥至剪贴板'
      const qrRkm = new QR_RKM()
      const qrkey = await qrRkm.decrypt(data)
      this.setData({
        qrkey: qrkey,
        qrKeyMask: true
      })
    } catch (error) {
      wx.showModal({
        title: '还原失败',
        content: error,
        showCancel: false
      })
    }
  },

  copyQrRckey(){
    wx.setClipboardData({
      data: this.data.qrRecoveryKey
    })
    this.closeQrRecoveryMask()
    app.$toast('已复制')
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.$shareAppMessage()
  }
})