// components/qrkey/index.js
import { getTemplate } from './qrTemplate'
import { QR_KM } from '../../magics/qrKeyManage'
import { getRandomStr } from '../../magics/util'
const app = getApp()
Component({
   /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      if(!this.data.qrkey) return this.getQrKey()
      this.drawQrKey(this.data.qrkey)
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function() {
    // 在组件实例进入页面节点树时执行
    if(!this.data.qrkey) return this.getQrKey()
    this.drawQrKey(this.data.qrkey)
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },
  /**
   * 组件的属性列表
   */
  properties: {
    qrkey: String,
    zIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    key: null,
    refresh: false,
    filepath: null,
    paletteData: {},
    saved: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    imageOkEvent({ detail }){
      this.setData({
        filepath: detail.path
      })
    },
    downloadImage(){
      try{
        let self = this
        if(!this.data.filepath) throw '图片获取失败，请稍后重试'
        wx.saveImageToPhotosAlbum({
          filePath:  this.data.filepath,
          success(){
            self.data.saved = true
            self.closeEvent()
          }
        })
      }catch(error){
        this.triggerEvent('error', error)
      }
    },
    closeEvent(){
      let self = this
      if(!this.data.saved) return wx.showModal({
        title: '关闭提醒',
        content: '您尚未保存密钥二维码，可能会无法查阅与之绑定的账密信息哦~~~',
        confirmText: '立刻保存',
        cancelText: '仍然关闭',
        success(ret){
          if(ret.confirm) return self.downloadImage()
          self.triggerEvent('close', {
            key: self.data.key
          })
        }
      })
      this.triggerEvent('close', {
        key: this.data.key
      })
    },
    async drawQrKey(qr_key){
      try{
        if(!qr_key) throw '请指定密钥串'
        const qrKM = new QR_KM()
        const verifyParams = await qrKM.decrypt(qr_key)
        this.setData({
          key: qr_key,
          paletteData: getTemplate(qr_key, verifyParams.qr_key_auth_code)
        })
      }catch(error){
        console.error(error)
        this.triggerEvent('error', error)
      }
    },
    async getQrKey(){
      try{
        this.setData({
          refresh: true,
          filepath: null,
          saved: false
        })
        const {
          qr_key_auth_code,
          qr_key_auth_vi
        } = await app.$api.key.createQR()
        if(!qr_key_auth_code || !qr_key_auth_vi) throw '密钥创建失败，请稍后重试'
        const qrKM = new QR_KM(qr_key_auth_code, qr_key_auth_vi)
        const passParams = {
          key: getRandomStr(32),
          vi: getRandomStr(24)
        }
        const qr_key = await qrKM.encrypt(passParams)
        const verifyParams = await qrKM.decrypt(qr_key)
        if(verifyParams.key !== passParams.key || verifyParams.vi !== passParams.vi) throw '密钥创建失败，请稍后重试'
        if(verifyParams.qr_key_auth_code !== qr_key_auth_code || verifyParams.qr_key_auth_vi !== qr_key_auth_vi) throw '密钥验证失败，申请被撤销'
        this.setData({
          refresh: false
        })
        this.drawQrKey(qr_key)
      }catch(error){
        this.setData({
          refresh: false
        })
        this.triggerEvent('error', error)
        console.error(error)
      }
    }
  }
})
