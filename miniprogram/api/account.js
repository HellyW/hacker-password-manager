import ajax from '../magics/ajax'

export const account = {
  getList(params = {}){
    return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.get('/account/', Object.assign({}, {
          index: 1,
          size: 20,
          filter: ''
        }, params))
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  },
  create(params = {}){
    return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.post('/account/', params)
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  },
  getDetail(id, params = {}){
    return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.get(`/account/${id}`, params)
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  },
  remove(id, qrkey){
    return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.delete(`/account/${id}`, {
          qrkey: qrkey
        })
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  },
  edit(id, params = {}){
    return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.put(`/account/${id}`, params)
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  }
}