// share.js
import ajax from '../magics/ajax'

export const share = {
  createShare(params = {}){
    return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.post('/share/', params)
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  },
  getShare(id){
    return new Promise(async (resolve, reject) =>{
      try {
        if(!id) throw 'id is missing'
        const ret = await ajax.get(`/share/${id}`)
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  }
}