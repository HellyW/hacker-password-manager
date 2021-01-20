export const checkUpdate = (force = false) => {
  // 版本升级检测
  const updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    // console.log(res.hasUpdate)
    if(res.hasUpdate) wx.showToast({
      title: '发现新版本',
    })
  })

  updateManager.onUpdateReady(function () {
    if(force) {
      wx.showToast({
        title: '正在升级新版本....',
        icon: 'none'
      })
      updateManager.applyUpdate()
      return 
    }
    wx.showModal({
      title: '升级提醒',
      content: '新版本已装载，重启应用完成升级',
      cancelText: '暂不重启',
      confirmText: '立即重启',
      success(ret){
        if(ret.confirm) updateManager.applyUpdate()
      }
    })
    
  })

  updateManager.onUpdateFailed(function () {
    // 新版本下载失败
  })
}