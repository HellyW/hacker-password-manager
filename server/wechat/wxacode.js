const request = require('request')
const path = require('path')
const fs = require('fs')

const savepath = '../uploads/codes/'

const util = require('../functions/util')
const wechatUtil = require('./util')
const URIS = require('./urls')

const getWXAcodeUnlimit = (pagePath, scene='') => {
	return new Promise(async (resolve, reject) => {
		try{
			if(!pagePath) throw 'path is required'
			scene = scene.toString()
			if(typeof scene !== 'string') throw 'sence must be string'
			// 获取access token
			let filename = `${util.getRandomStr(24)}.jpeg`
            if (!fs.existsSync(path.join(__dirname, savepath))) fs.mkdirSync(path.join(__dirname, savepath))
            let writeStream = fs.createWriteStream(path.join(__dirname, savepath, filename))

			const accessToken = await wechatUtil.getAccessToken()
			const readStream =  request({
				uri: `${URIS.wxacode.getUnlimit}?access_token=${accessToken}`,
				method: 'POST',
				json: true,
				body: {
					path: pagePath,
					scene: scene
				}
			})
			// 将图片进行存储
			readStream.pipe(writeStream)
            readStream.on('end', function() {
                // 文件下载成功
            });
            readStream.on('error', function(err) {
                reject(err)
            })
            writeStream.on("finish", function() {
                // 文件写入成功
                writeStream.end()
                resolve(`${savepath}${filename}`)
            });
		}catch(e){
			reject(e)
		}
	})
}

module.exports = {
	getWXAcodeUnlimit
}