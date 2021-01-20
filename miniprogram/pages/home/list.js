// pages/home/list.js
import { formatDate } from '../../magics/util'
const app = getApp()
Page({
  data: {
    accounts: [],
    index: 1
  },
  onLoad(options) {
    wx.startPullDownRefresh({})
  },
  onReady(){
    
  },
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  getAccounts() {
    return new Promise(async (resolve, reject) => {
      try {
        wx.showLoading({
          title: '正在努力加载中',
        })
        let { accounts } = await app.$api.account.getList({
          index: this.data.index
        })
        accounts = accounts.map(v => {
          v.createAt = formatDate(v.createAt)
          v.updateAt = formatDate(v.updateAt)
          return v
        })
        this.setData({
          accounts: this.data.index === 1 ? accounts : this.data.accounts.concat(accounts),
          index: ++this.data.index
        })
        wx.hideLoading({})
        resolve()
      } catch (error) {
        console.log(error)
        wx.hideLoading({})
        reject(error)
      }
    })

  },
  getDetail({ currentTarget }) {
    try {
      const {
        id,
        qrkey
      } = currentTarget.dataset
      if (!id) throw '出了点小错，请重新点击再试'
      if (!qrkey) throw '未能找到绑定密钥信息，请稍后重试'
      wx.navigateTo({
        url: `/account/pages/detail?id=${id}&key=${qrkey}`
      })
    } catch (error) {
      console.log(error)
    }
  },
  
  async onPullDownRefresh() {
    try{
      this.data.index = 1
      await this.getAccounts()
      wx.stopPullDownRefresh({})
    }catch(error){
      wx.stopPullDownRefresh({})
      app.$toast(error)
    }
  },
  async onReachBottom(){
    try{
      await this.getAccounts()
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