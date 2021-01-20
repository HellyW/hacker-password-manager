// components/clipboard-card/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    describe: {
      type: String,
      value: '点击右上角复制按钮，可快速复制'
    },
    value: {
      type: String,
      required: true
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    copyEvent(){
      try{
        wx.setClipboardData({
          data: this.data.value
        })
        app.$toast('复制成功')
      }catch(error){
        app.$toast('复制失败，请稍后重试')
      }
    }
  }
})
