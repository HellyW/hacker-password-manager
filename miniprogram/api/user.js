import ajax from '../magics/ajax'
import CONFIG from '../config/index'

export const user = {
  login(){
    return new Promise(async (resolve, reject) =>{
      try {
        const loginRet = await wx.login()
        if(!loginRet.code) throw '登录失败，未获得微信授权。请稍后重试'
        const session = await ajax.post('/user/', {
          code: loginRet.code
        })
        if(!session) throw '登录失败，请稍后重试'
        // 更新有效的session
        wx.setStorageSync(CONFIG.SESSION_STORAGE_KEY, session)
        resolve(session)
      } catch (error) {
        reject(error)
      }
    })
  },
  getUserinfo(){
    return new Promise(async (resolve, reject) =>{
      try {
        const userinfo = await ajax.get('/user/')
        resolve(userinfo)
      } catch (error) {
        reject(error)
      }
    })
  },
  suicide(){
    return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.delete('/user/')
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  }
}