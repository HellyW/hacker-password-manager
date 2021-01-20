const router = require('express').Router()

router.use('/user', require('./user'))
router.use('/key', require('./key'))
router.use('/share', require('./share'))
router.use('/account', require('./account'))
router.use('/category', require('./category'))

module.exports = router
