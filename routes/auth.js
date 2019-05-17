const router = require('koa-router')()
// 鉴权
router.prefix('/auth')

router.get('/', async (ctx, next) => {
  ctx.body = {}
})

module.exports = router
