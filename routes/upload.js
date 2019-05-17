const router = require('koa-router')()
const koaBody = require('koa-body')
const upload = require('../controller/upload')

// 鉴权
router.prefix('/upload')

router.post('/', koaBody(), upload.upload)

module.exports = router
