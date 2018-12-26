const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const url = require('url')
const db = require('./pub/model/chat_online/db')
const util = require('./pub/util/index')
const router = require('./routers/index');
const bodyParser = require('koa-bodyparser');
// const static = require('koa-static');

const send = require('koa-send')
const etag = require('etag')

const limit = require('koa-limit')

// WebSocketServer
const WebSocket = require('ws')

const app = new Koa()

let server = app.listen(3000)

const chat_online_wss = new WebSocket.Server({
  noServer: true
})

app.use(async (ctx, next) => {
  await db.connect()
  await next()
})

const user_online = [] // 在线用户列表
let notify = "" // 公告

chat_online_wss.on('connection', function connection(ws, req) {

  let username = util.getUrlParam(req.url, 'username')

  user_online.push(username)

  let user_online_option = {
    type: 'user_online_response',
    content: {
      useronline: chat_online_wss.clients.size,
      userlist: user_online
    }
  }

  chat_online_wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      // 推送公告
      if (notify && client === ws) {
        client.send(notify)
      }
      // 推送在线用户列表
      client.send(JSON.stringify(user_online_option))

      if (username !== 'null') {
        var user_log_message_option = {
          type: 'log_message',
          content: {
            message: username + '进入了房间'
          }
        }
        // 推送进入房间消息
        client.send(JSON.stringify(user_log_message_option))
      }
    }
  })

  ws.on('message', function(msg) {
    if (username !== 'null') {
      // 修改公告
      if (JSON.parse(msg).type === 'notify_publish') {
        if (!JSON.parse(msg).content.title && !JSON.parse(msg).content.content) {
          notify = ''
        } else {
          notify = msg
        }
      }

      // 推送聊天消息
      chat_online_wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(msg)
        }
      })
    }
  })

  ws.on('close', function() {
    // 断开连接时更新在线用户列表
    user_online.splice(user_online.indexOf(username), 1)

    var user_online_option = {
      type: 'user_online_response',
      content: {
        useronline: chat_online_wss.clients.size,
        userlist: user_online
      }
    }

    chat_online_wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        // 推送在线用户列表
        client.send(JSON.stringify(user_online_option))

        if (username !== 'null') {
          var user_log_message_option = {
            type: 'log_message',
            content: {
              message: username + '离开了房间'
            }
          }
          // 推送离开房间消息
          client.send(JSON.stringify(user_log_message_option))
        }
      }
    })
  })
})

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname

  if (pathname === '/chat_online') {
    chat_online_wss.handleUpgrade(request, socket, head, function done(ws) {
      chat_online_wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

app.use(bodyParser());

// //设置静态目录
// app.use(
//   static(path.join(__dirname, staticPath))
// )

// DDOS
// app.use(limit({
//   limit: 25,
//   interval: 10 * 1000,
//   message: '您的请求过于频繁'
// }));

// 设置router
app.use(router.routes()).use(router.allowedMethods())

// 缓存策略
app.use(async (ctx, next) => {
  let staticPath = './static'

  if (ctx.path === '/') {
    ctx.path = '/index'
  }

  try {
    await send(ctx, ctx.path, {
      root: path.join(__dirname, staticPath),
      index: 'index.html',
      maxage: 24 * 60 * 60 * 1000, // 强缓存1小时
      setHeaders: (res, path, stats) => {
        // res.setHeader('Last-Modified', stats.mtime.toUTCString())
        res.setHeader('Etag', etag(stats))
      }
    })
  } catch (error) {
    // 404
    if (error.code === 'ENOENT' && error.status === 404) {
      ctx.path = '/404'
      await send(ctx, ctx.path, {
        root: path.join(__dirname, staticPath),
        index: 'index.html',
        maxage: 24 * 60 * 60 * 1000, // 强缓存1小时
        setHeaders: (res, path, stats) => {
          // res.setHeader('Last-Modified', stats.mtime.toUTCString())
          res.setHeader('Etag', etag(stats))
        }
      })
    }
  }


  if (ctx.fresh) {
    ctx.status = 304
  }

  next()
})



console.log('app started at port 3000...')