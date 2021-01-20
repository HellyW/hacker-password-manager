// components/qrscan/index.js
import { QR_KM } from '../../magics/qrKeyManage'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    authCode: String,
    showAddButton: {
      type: Boolean,
      value: true
    }
  },

  observers: {
    authCode(newVal, oldVal){
      if(newVal) {
        this.setData({
          tips: `请扫描${newVal.replace(/^(\w{5}).*(\w{6})$/, "0x$1****$2")}密钥二维码按文件`
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    qrKeyMask: false,
    tips: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeEvent(){
      this.triggerEvent('close')
    },
    qrKeyMaskCloseEvent({detail}){
      if(!detail.key) return
      this.setData({
        qrKeyMask: false
      })
      this.decryptData({
        result: detail.key
      })
    },
    createKey(){
      this.setData({
        qrKeyMask: true
      })
    },
    async decryptData(ret){
      try{
        const encryptData = ret.result
        if(!encryptData) throw '请扫描系统内生成的密钥二维码'
        const qrKM = new QR_KM()
        const decryptData = await qrKM.decrypt(encryptData)
        if(!decryptData.key  || !decryptData.vi) throw '密钥二维码有损坏，请重新创建'
        if(this.data.authCode && decryptData.qr_key_auth_code !== this.data.authCode) throw '请扫描创建时绑定的密钥二维码'
        this.triggerEvent('scan', {
          ...decryptData,
          qrkey: encryptData
        })
      }catch(error){
        console.log(error)
        this.triggerEvent('error', error)
      }
    },
    async scanCode(){
      try{
        const ret = await  wx.scanCode({
          scanType: ["qrCode"]
        })
        this.decryptData(ret)
      }catch(error){
        if(error.errMsg === "scanCode:fail cancel") return
        this.triggerEvent('error', error)
      }
     
    },
    scanCodeSuccess({detail}){
      try{
        this.decryptData(detail)
      }catch(error){
        this.triggerEvent('error', error)
      }
    }
  }
})
