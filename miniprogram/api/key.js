import ajax from '../magics/ajax'

export const key = {
  createQR(){
    return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.post('/key/qr')
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  },
  getQR(code){
    return new Promise(async (resolve, reject) =>{
      try {
        if(!code) throw 'qrkey code is missing'
        const ret = await ajax.get('/key/qr', {
          code: code
        })
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  },
  createRcQR(){
    return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.post('/key/recovery')
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  },
  getRcQR(pass){
    return new Promise(async (resolve, reject) =>{
      try {
        if(!pass) throw 'pass is missing'
        const ret = await ajax.get('/key/recovery', {
          pass: pass
        })
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  }
}