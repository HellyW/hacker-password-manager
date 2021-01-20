/**
 * @name: request.js
 * @version: v1.0.0
 * @description: 借鉴了axios对于请求和响应的处理; 微信请求类，Promise化、抽象了配置参数、引入了中断操作
 * @author: HellyW
 */

// 支持的方法名
export const METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
// 默认配置
 const OPTS = {
  header: {
    'content-type': 'application/json'
  },
  timeout: 5000,
  method: 'GET',
  dataType: 'json'
 }
 export class mp_axios {
   constructor(opts){
     this.opts = Object.assign({}, OPTS, opts)
     if(!this.opts.host) throw 'host is required'
     this._initInterceptors()
   }
   _initInterceptors(){
    this._interceptors = {
      request: (config = {}) => config,
      response: (response) => {
        return Promise.resolve(response)
      }
    }
    this.interceptors = {
      request:fn => {
        this._interceptors.request = (config = {}) => {
          return fn(config) || {}
        }
      },
      response: fn => {
        this._interceptors.response =  (response, config) => {
          return response && fn(response, config)
        }
      }
     }
   }
   request(options = {}){
     return new Promise((resolve, reject)=>{
       try{
        //  请求url
         if(!options.url) throw 'url is required'
        //  调用前置请求中断器
        let config = this._interceptors.request(Object.assign({
          data: {}
        }, this.opts, options))
        // 处理url
        config.url = `${config.host}${config.url}`
        // 请求方法合法性判断
        if(METHODS.indexOf(config.method) === -1) throw 'method is unsupported'
        const self = this
        const wxRequestFn = config.header['content-type'] === 'multipart/form-data' && config.method === 'POST' ?  wx.uploadFile : wx.request
        wxRequestFn({
          ...config,
          complete(response){
            resolve(self._interceptors.response(response, config))
          }
        })
       }catch(err){
         reject(err.message || err.errMsg || err)
       }
     })
   }
 }

