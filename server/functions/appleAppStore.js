// appleAppStore.js
// 苹果市场应用
const request = require('request')
class appleAppStore {
	// 获取app详情
	getAppInfo(name){
		return new Promise((resolve, reject) => {
			try{
				request({
					url: `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=software`,
					method: "GET"
				}, (error, response, ret) => {
					try{
						if(error) throw error
						if(typeof ret === 'string') ret = JSON.parse(ret)
						// 仅返回第一条数据
						resolve(ret.results[0])
					}catch(error){
						reject(error)
					}
				})
			}catch(e){
				reject(e)
			}
		})
	}
	// 获取app图标链接
	getAppIconUrl(name){
		return new Promise(async (resolve, reject) => {
			try{
				const {
					artworkUrl512
				} = await this.getAppInfo(name)
				resolve(artworkUrl512)
			}catch(e){
				reject(e)
			}
		})
	}
}

module.exports = appleAppStore

