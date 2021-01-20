// components/accountCategory/index.js
const CONFIG = require('../../config/index')
const app = getApp()
Component({
  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.refreshCategory()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function() {
    // 在组件实例进入页面节点树时执行
    this.refreshCategory()
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    categories: [],
    selected: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseEvent(e){
      const category = e.currentTarget.dataset.category
      this.setData({
        selected: category
      })
    },
    async apply(){
      wx.navigateTo({
        url: '/category/pages/apply'
      })
      this.triggerEvent('close')
    },
    save(){
      this.triggerEvent('select', this.data.selected)
    },
    closeEvent(){
      this.triggerEvent('close')
    },
    refreshCategory(){
      try{
        this.data.index = 1
        this.getCategories()
      }catch(error){
        app.$toast(error)
      }
    },
    async getCategories(){
      try{
        const { categories } = await app.$api.category.getList({
          index: this.data.index
        })
        const _categories = categories.map(v => {
          v.icon = `${CONFIG.HOST}/${v.icon}`
          return v
        })
        this.setData({
          categories: this.data.index++ === 1 ? _categories : this.data.categories.concat(_categories)
        })
      }catch(error){
        app.$toast(error)
      }
    }
  }
})
