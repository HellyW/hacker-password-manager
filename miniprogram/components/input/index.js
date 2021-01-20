// components/input/index.js
const app = getApp()
Component({
  behaviors: ['wx://form-field', 'wx://form-field-group'],
  /**
   * 组件的属性列表
   */
  
  properties: {
    name: String,
    value: String,
    maxlength: Number,
    label: {
      type: String,
      required: true
    },
    describe: String,
    placeholder: String,
    type: {
      type: String,
      value: 'text'
    },
    adjustPosition: {
      type: Boolean,
      value: true
    },
    disabled: {
      type: Boolean,
      value: false
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    originalImage: null,
    cutImage: null,
    screenWidth: wx.getSystemInfoSync().screenWidth
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputEvent({ detail }){
      this.setData({
        value: detail.value
      })
      this.triggerEvent('input', detail)
    },
    finCut(){
      let self = this
      this.selectComponent("#image-cropper").getImg(( {url} )=>{
        self.uploadImage(url)
      })
    },
    async uploadImage(url){
      try{
        const ret = await app.$api.category.uploadIcon(url)
        this.setData({
          value: ret.path,
          cutImage: url,
          originalImage: null
        })
        this.triggerEvent('input', {
          value: ret.path
        })
      }catch(error){
        app.$toast(error)
        console.log(error)
      }
    },
    loadLocalImage(){
      try{
        let self = this
        wx.chooseImage({
          count: 1,
          success(res){
            if(!res.tempFilePaths[0]) return
            self.setData({
              originalImage: res.tempFilePaths[0]
            })
          }
        })
      }catch(error){
        app.$toast(error)
        console.log(error)
      }
    }
  }
})
