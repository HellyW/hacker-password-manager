// components/half-dialog/index.js
Component({
      /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.keyBoardListen()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function() {
    // 在组件实例进入页面节点树时执行
    this.keyBoardListen()
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 主标题
    title: String,
    // 副标题： 描述
    describe: String,
    showClose: {
      type: Boolean,
      value: true
    },
    modal: {
      type: Boolean,
      value: false
    },
    zIndex: {
      type: Number,
      value: 0
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    bottom: 20
  },

  /**
   * 组件的方法列表
   */
  methods: {
    keyBoardListen(){
      let self = this
      wx.onKeyboardHeightChange(res => {
        self.setData({
          bottom: res.height + 20
        })
      })
    },
    closeEvent({ detail }){
      this.triggerEvent('close', detail)
    }
  }
})
