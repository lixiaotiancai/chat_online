const router = require('koa-router')()
const db = require('../pub/model/chat_online/db')
const userModel = require('../pub/model/chat_online/user')

router.post('/login', async ctx => {
  const postData = ctx.request.body
  let username = postData.username
  let password = postData.password

  if (await userModel.isSystemUser(username, password)) {
    userModel.setUserCookie(encodeURIComponent(username), ctx)

    ctx.body = {
      success: true,
      retcode: 0
    }
  } else {
    ctx.body = {
      success: false,
      message: '用户名或密码错误'
    }
  }
})

router.post('/logout', async ctx => {
  const user = await userModel.checkUserCookie(ctx)

  if (user) {
    userModel.clearUserCookie(ctx)
    ctx.body = {
      success: true,
      retcode: 0
    }
  } else {
    ctx.body = {
      success: false,
      message: '请先登录'
    }
  }
})

router.get('/get_userinfo', async ctx => {
  const user = await userModel.checkUserCookie(ctx)

  if (user) {
    ctx.body = {
      is_login: true,
      username: user.username
    }
  } else {
    ctx.body = {
      is_login: false
    }
  }
})

router.post('/sign', async ctx => {
  const postData = ctx.request.body
  let username = postData.username
  let password = postData.password

  if (await userModel.hasSystemUser(username)) {
    ctx.body = {
      success: false,
      message: '用户已存在'
    }
  } else {
    await userModel.userSignUp(username, password)
    ctx.body = {
      success: true,
      retcode: 0
    }
  }

})

router.get('/get_system_user', async ctx => {
  const system_user_num = await userModel.allSystemUser()

  ctx.body = {
    user: system_user_num
  }
})

module.exports = router