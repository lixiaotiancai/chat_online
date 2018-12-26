const router = require('koa-router')()
const chatOnline = require('./chat_online')

router.use('/chat_online/api', chatOnline.routes(), chatOnline.allowedMethods())

module.exports = router