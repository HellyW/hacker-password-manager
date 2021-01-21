// category.js
import ajax from '../magics/ajax'
import CONFIG from '../config/index'

export const category = {
  getList(params = {}){
    return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.get('/category/', Object.assign({}, {
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
  apply(params = {}){
  	return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.post('/category/', params)
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  },
  uploadIcon(filePath){
    return new Promise(async (resolve, reject) =>{
      try {
        const ret = await ajax.post('/upload', {

        }, {
          host: CONFIG.HOST,
          name: 'picture',
          filePath: filePath,
          header: {
            'content-type': 'multipart/form-data'
          }
        })
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  },
  getSmartIcon(name){
    return new Promise(async (resolve, reject) =>{
      try {
        if(!name) throw 'name is null'
        const ret = await ajax.get('/category/smart_icon', {
          name: name
        })
        resolve(ret)
      } catch (error) {
        reject(error)
      }
    })
  }
}