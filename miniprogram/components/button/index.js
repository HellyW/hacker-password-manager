// components/button/index.js
Component({
  /**
   * 组件的属性列表
   */
  behaviors: ['wx://form-field-button'],
  properties: {
    icon: String,
    loading: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    size: {
      type: String,
      value: 'primary'
    },
    formType: String,
    openType: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    touching: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getuserinfoEvent({ detail }){
      this.triggerEvent('getuserinfo', detail)
    },
    touchStartEvent(){
      this.setData({
        touching: true
      })
    },
    touchEndEvent(){
      setTimeout(() => {
        this.setData({
          touching: false
        })
      }, 500)
      
    }
  }
})
