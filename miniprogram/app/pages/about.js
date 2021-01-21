// app/pages/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    references:[{
      name: '开源地址',
      describe: 'https://github.com/wahao/hacker-password-manager'
    },{
      name: 'crypto-js',
      describe: 'https://github.com/brix/crypto-js'
    },{
      name: 'Painter',
      describe: 'https://github.com/Kujiale-Mobile/Painter'
    },{
      name: 'image-cropper',
      describe: 'https://github.com/wx-plugin/image-cropper'
    },{
      name: 'iconfont',
      describe: 'https://www.iconfont.cn'
    }]
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