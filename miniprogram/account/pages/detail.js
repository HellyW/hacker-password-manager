// account/pages/detail.js
import { AES, base64Encode } from  "../../magics/crypto"
import { formatDate } from '../../magics/util'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    authCode: null,
    qrkey: null,
    qrScanMask: true,
    account: null,
    decodeStr: null,
    shareposterMask: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try{
      this.setData({
        id: options.id,
        authCode: options.key
      })
      if(!this.data.id || !this.data.authCode) throw '参数传递错误，请稍后重试'
    }catch(error){
      app.$toast(error)
      setTimeout(()=>{
        wx.navigateBack()
      }, 1500)
    }

  },

  removeAccount(){
    try{
      let self = this
      wx.showModal({
        title: '删除确认',
        content: '删除后将无法找回，请确认要继续操作？',
        confirmText: '删除',
        cancelText: '手滑',
        async success(ret){
          // 确认删除
          if(!ret.confirm) return 
          try{
            await app.$api.account.remove(self.data.id, self.data.authCode)
            app.$toast('删除成功，即将返回首页')
            setTimeout(()=>{
              wx.navigateBack()
            }, 1500)
          }catch(error){
            app.$toast(error)
          }
        }
      })
    }catch(error){
      app.$toast(error)
    }
  },

  async getAccount(){
    try{
      const { code } = await wx.login()
      const ret = await app.$api.account.getDetail(this.data.id, {
        code,
        qrkey: this.data.authCode
      })
      const aes = new AES(this.data.qrkey.key, this.data.qrkey.vi)
      ret.password = aes.decrypt(ret.password)
      ret.safeInfo = ret.safeInfo.map(v=> {
        return {
          key: v.key,
          value: aes.decrypt(v.value)
        }
      })
      ret.createAt = formatDate(ret.createAt)
      ret.updateAt = formatDate(ret.updateAt)
      this.setData({
        account: ret
      })
    }catch(error){
      app.$toast(error)
    }
  },

  qrScanErrorEvent({ detail }){
    app.$toast(detail)
  },

  qrScanCloseEvent(){
    if(!this.data.qrkey) return wx.navigateBack()
    this.setData({
      qrScanMask: false
    })
  },

  qrScanEvent({ detail }){
    this.data.qrkey = detail
    this.setData({
      qrScanMask: false
    })
    this.getAccount()
  },

  shareposterErrorEvent({ detail }){
    console.log(detail)
    app.$toast(detail)
  },

  shareAccount(){
    const {
      account,
      name,
      password,
      safeInfo
    } = this.data.account || {}
    this.setData({
      decodeStr: base64Encode(JSON.stringify({
        account,
        name,
        password,
        safeInfo
      })),
      shareposterMask: true
    })
  },

  async editAccount(){
    try{
      const  {eventChannel} = await wx.navigateTo({
        url: "/account/pages/edit"
      })
      const {
        id,
        qrkey,
        account: formData
      } = this.data || {}
      formData.qrkey = qrkey
      formData.key = qrkey.qr_key_auth_code.replace(/^(\w{5}).*(\w{6})$/, "0x$1****$2")
      eventChannel.emit('editAccount', {
        id,
        qrkey,
        formData
      })
    }catch(error){
      app.$toast(error)
    }
  },

  shareposterCloseEvent(){
    this.setData({
      shareposterMask: false
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().$shareAppMessage()
  }
})