// components/navigation/index.js
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
    hideHomeButton: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pageCount: 0,
    height: 180
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initComponent(){
      // 隐藏官方的首页按钮
      wx.hideHomeButton()
      this.setData({
        pageCount: (getCurrentPages() || []).length,
        height:  (wx.getMenuButtonBoundingClientRect().bottom || 180) + 20
      })
    },
    backEvent(){
      wx.navigateBack({})
    },
    relaunchEvent(){
      wx.reLaunch({
        url: '/pages/home/list',
      })
    }
  }
})
