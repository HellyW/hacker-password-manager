// components/network-image/index.js
const CONFIG = require('../../config/index')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: String,
    preview: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    host: CONFIG.HOST,
    imageError: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    errorEvent(){
      this.setData({
        imageError: true
      })
    },
    previewImage(){
      if(!this.data.preview) return
      wx.previewImage({
        urls: [`${this.data.host}/${this.data.src}`],
      })
    }
  }
})
