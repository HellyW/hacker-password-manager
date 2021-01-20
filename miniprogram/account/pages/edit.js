// account/pages/edit.js
import { AES } from  "../../magics/crypto"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryMask: false,
    qrkeyMask: false,
    id: null,
    qrkey: null,
    formData: null,
    adding: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    let self = this
    eventChannel.on('editAccount', function(data) {
      self.setData({
        ...data
      })
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

  addSafeInfoInput(){
    if(!this.data.formData.safeInfo)  this.data.formData.safeInfo = []
    this.data.formData.safeInfo.push({
      key: `默认标题-${this.data.formData.safeInfo.length + 1}`,
      value: ''
    })
    this.setData({
      formData: this.data.formData
    })
  },

  inputSafeInfo(event){
    const {
      index,
      key
    } = event.currentTarget.dataset
    const {
      value
    } = event.detail
    this.data.formData.safeInfo[index][key] = value
    this.setData({
      formData: this.data.formData
    })
  },

  
  removeCurrentOption({currentTarget}){
    const {
      index
    } = currentTarget.dataset
    this.data.formData.safeInfo.splice(index, 1)
    this.setData({
      formData: this.data.formData
    })
  },

  showQrkeyMask(){
    this.setData({
      qrkeyMask: true
    })
  },

  closeQrkeyMask(){
    this.setData({
      qrkeyMask: false
    })
  },

  accountCategorySelectEvent({detail}){
    this.data.formData.category = detail
    this.setData({
      categoryMask: false,
      formData: this.data.formData
    })
  },

  scanQrkeyEvent({detail}){
    this.data.formData.qrkey = detail
    this.data.formData.key = detail.qr_key_auth_code.replace(/^(\w{5}).*(\w{6})$/, "0x$1****$2")
    this.setData({
      qrkeyMask: false,
      formData: this.data.formData
    })
  },

  scanQrkeyErrorEvent({detail}){
    app.$toast(detail)
  },

  showCategoryMask(){
    this.setData({
      categoryMask: true
    })
  },
  
  closeCategoryMask(){
    this.setData({
      categoryMask: false
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  
  async editAccount({ detail }){
    try{
      this.setData({
        adding: true
      })
      const accountInfo = Object.assign({}, this.data.formData || {}, detail.value)
      if(!accountInfo.qrkey) throw '请先扫描密钥二维码'
      if(!accountInfo.category) throw '请先选择账号类型'
      if(!accountInfo.name) throw '请输入账号别名'
      const { code } = await wx.login({})
      let params = {
        code,
        vaildKey: this.data.qrkey && this.data.qrkey.qr_key_auth_code,
        name: accountInfo.name,
        account: accountInfo.account,
        password: accountInfo.password,
        safeInfo: accountInfo.safeInfo || [],
        category: accountInfo.category && accountInfo.category.id,
        qrkey: accountInfo.qrkey && accountInfo.qrkey.qr_key_auth_code
      }
      const aes = new AES(accountInfo.qrkey.key, accountInfo.qrkey.vi)
      params.password = aes.encrypt(params.password)
      params.safeInfo = params.safeInfo.map(v => {
        return {
          key: v.key,
          value: aes.encrypt(v.value)
        }
      })
      const ret = await app.$api.account.edit(this.data.id, params)
      this.setData({
        adding: false
      })
      app.$toast('修改成功， 即将返回首页')
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/home/list',
        })
      }, 1000)
    }catch(error){
      this.setData({
        adding: false
      })
      app.$toast(error)
      console.error(error)
    }
    
  },

  formdataInputEvent(event){
    this.data.formData[event.target.dataset.key] = event.detail.value
    this.setData({
      formData: this.data.formData
    })
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