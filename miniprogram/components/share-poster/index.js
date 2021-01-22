// components/share-poster/index.js
import { getTemplate } from './posterTemplate'
const CONFIG = require("../../config/index")
import { AES } from '../../magics/crypto'
const app = getApp()
Component({
     /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.initComponent()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function() {
    // 在组件实例进入页面节点树时执行
    this.initComponent()
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },
  /**
   * 组件的属性列表
   */
  properties: {
    decodeStr: {
      type: String,
      required: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    formMask: true,
    paletteData: {},
    filepath: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initComponent() {
      try{
        if(!this.data.decodeStr) throw '分享失败，缺少必要参数'
        this.setData({
          formMask: true,
          filepath: null
        })
      }catch(error){
        this.triggerEvent('error', error)
      }
    },
    imageOkEvent({ detail }){
      this.setData({
        filepath: detail.path
      })
    },
    closeEvent(){
      this.triggerEvent('close')
    },
    downloadImage(){
      try{
        if(!this.data.filepath) throw '图片获取失败，请稍后重试'
        if(wx.showShareImageMenu){
          wx.showShareImageMenu({
            path:  this.data.filepath
          })
        }else{
          wx.saveImageToPhotosAlbum({
            filePath:  this.data.filepath,
            success(){
              wx.showToast({
                icon: 'success',
                title: '已保存至相册，您可以选择分享'
              })
            }
          })
        }
        this.closeEvent()
      }catch(error){
        this.triggerEvent('error', error)
      }
    },
    async createPoster({ detail }){
      try{
        if(!this.data.decodeStr) throw '分享失败，缺少必要参数'
        const formData = detail.value || {}
        if(!formData.name) throw '请输入别名'
        if(!formData.code) throw '您必须输入访问码'
        const codeRegx = /^\d{6}$/
        if(!codeRegx.test(formData.code)) throw '访问码必须为6位纯数字'
        const aes = new AES(CONFIG.share_key_plain, formData.code)
        const encryptStr = aes.encrypt(this.data.decodeStr)
        // code 用作本地加密和解密，不上传至服务端
        const { path, expired } = await app.$api.share.createShare({
          name: formData.name,
          encryptStr,
          isTemp: formData.isTemp
        })
        this.setData({
          formMask: false,
          paletteData: getTemplate(formData.name, formData.code, `${CONFIG.HOST}/${path}`, expired)
        })
      }catch(error){
        this.triggerEvent('error', error)
      }
    }
  }
})
