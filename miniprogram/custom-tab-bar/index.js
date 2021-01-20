// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    pages: [{
      icon: 'list',
      path: '/pages/home/list',
      type: 'switchTab',
      selected: 0
    },{
      icon: 'add',
      path: '/pages/home/add',
      type: 'navigatePage'
    },{
      icon: 'app',
      path: '/pages/home/my',
      type: 'switchTab',
      selected: 1
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e){
       try{
         const data = e.currentTarget.dataset
         let self = this
         switch(data.type){
          case 'switchTab': {
            wx.switchTab({
              url: data.path,
              success(){
                self.setData({
                  selected: data.selected
                })
              }
            })
            break
          }
          case 'navigatePage': {
            wx.navigateTo({
              url: data.path
            })
            break
          }
         }
       }catch(error){
        console.log(error)
       }
    }
  }
})
