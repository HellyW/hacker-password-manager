const uuid = require('uuid')
const request = require('request')

const util = {}

const objectIdRegx = new RegExp(/^\w{24}$/)
const charsets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_"

util.getUUID = () => {
  return uuid.v4().replace(/\-/g, '').toLowerCase()
}

util.getRandomStr = (len = 10) => {
  let randomStr = ""
  for (var i = 0; i < len; i++) {
    randomStr += charsets.charAt(Math.floor(Math.random() * charsets.length))
  }
  return randomStr
}

util.base64Encode = str => {
  return new Buffer(str).toString('base64')
}

util.base64Decode = str => {
  return new Buffer(str, 'base64').toString('utf-8')
}


util.isObjectId = id => {
	return objectIdRegx.test(id)
}


util.downloadImage = url => {
	return new Promise((resolve, reject) => {
		try{
			const filePath = path.join(__dirname, '../uploads/download/')
			let filename = `${util.getRandomStr(32)}.jpeg`
			if (!fs.existsSync(filePath)) fs.mkdirSync(filePath) 
			let writeStream = fs.createWriteStream(path.join(__dirname, filePath, filename))
			const readStream =  request({
				uri: url,
				method: 'GET'
			}) 
			// 将图片进行存储
			readStream.pipe(writeStream)
            readStream.on('end', function() {
                // 文件下载成功
            })
            readStream.on('error', function(err) {
                reject(err)
            })
            writeStream.on("finish", function() {
                // 文件写入成功
                writeStream.end()
                resolve(`${filePath}${filename}`)
            })
		}catch(error){
			reject(error)
		}
	})

}

module.exports = util