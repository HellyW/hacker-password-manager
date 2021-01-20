// components/icon/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: {
      type: String,
      value: 'primary'
    },
    icon: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    noError: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadErrorEvent(){
      this.setData({
        noError: false
      })
    }
  }
})
