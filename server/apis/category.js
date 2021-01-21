// category.js
const router = require('express').Router()
const util = require('../functions/util')
const appleAppStore = require('../functions/appleAppStore')
const model = require('../model')

const appStore = new appleAppStore()

router.post('/', async (req, res, next) => {
	try{
		if(!req.operator) throw "NO_AUTH"
	    if(!req.body.name) throw '类目名不可为空'
	    if(!req.body.icon) throw '请设置一个可识别的有效图标'
	    category = await model.CATEGORY.findOne({
	    	name: req.body.name
	    })
	  	if(category){
	  		if(category.public) throw '您所申请的账号类型已存在，可直接选择使用'
	  		category.public = true
	  		category.weight++
	  	}else{
	  		category = new model.CATEGORY({
		    	name: req.body.name,
			    icon: req.body.icon,
			    website: req.body.website,
			    owner: req.operator._id
		    })
	  	}
	    const {
	    	_id: id,
	    	name,
	    	icon,
	    	website
	    } = await category.save()
        next({
        	id,
        	name,
		    	icon,
		    	website
        })
	}catch(error){
		next(error)
	}
})

router.get('/', async (req, res, next) => {
	try{
		if(!req.operator) throw "NO_AUTH"
	    const {
	      filter,
	      index,
	      size
	    } = req.query
	    const dbFilter = {
	    	"name": new RegExp(`${filter}`, 'g'),
		    "$or": [{ "public": true }, { "owner": req.operator._id }]
	    }
	    const categories = await model.CATEGORY.find(dbFilter)
		                                       .sort({"weight": -1})
		                                       .skip(((index || 1) - 1) * (size || 20))
		                                       .limit(size||20)
        next({
	      categories: categories.map(v=>{
	        return {
	          id: v._id,
	          name: v.name,
	          icon: v.icon,
	          website: v.website
	        }
	      })
	    })
	}catch(error){
		next(error)
	}
})

router.get('/smart_icon', async (req, res, next) => {
	try {
		if(!req.operator) throw "NO_AUTH"
		if(!req.query.name) throw "请输入类型名称"
		const iconUrl = await appStore.getAppIconUrl(req.query.name)
		if(!iconUrl) throw "未能获取图标"
		const localPath = await util.downloadImage(iconUrl)
		next({
			path: localPath.replace("../uploads", 'upload')
		})
	}catch(error){
		next(error)
	}
})

module.exports = router