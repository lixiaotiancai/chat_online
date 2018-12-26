const router = require('koa-router')()
const Db = require('./db')

let userSession = {}

const UserModel = {
  allSystemUser: async () => {
    let userList = []
    let options = {}

    return await Db.find(options, function(err, docs) {
      let userListCopy = [...userList]

      docs.forEach(user => {
        userListCopy.push({
          username: user.username
        })
      })

      userList = null

      return userListCopy
    })
  },

  hasSystemUser: async username => {
    let len
    let options = {
      username: username
    }

    await Db.find(options, function(err, docs) {
      len = docs.length
    })

    return len ? true : false
  },

  isSystemUser: async (username, password) => {
    let len
    let options = {
      username: username,
      password: password
    }

    await Db.find(options, function(err, docs) {
      len = docs.length
    })

    return len ? true : false
  },

  setUserCookie: (username, ctx) => {
    const userkey = 'userkey_' + Math.random() * 1000

    ctx.cookies.set('username', username, {
      httpOnly: false
    })
    ctx.cookies.set('userkey', userkey, {
      httpOnly: false
    })

    userSession[username] = userkey
  },

  checkUserCookie: async ctx => {
    const userkey = ctx.cookies.get('userkey')

    let username = null

    for (let key in userSession) {
      if (userSession[key] === userkey) {
        username = key

        let userDetail = await UserModel.getUserDetail(username)

        return userDetail
      }
    }

    return null
  },

  clearUserCookie: ctx => {
    const username = ctx.cookies.get('username')

    userSession[username] = null

    ctx.cookies.set('username', '', {
      expires: new Date(0)
    })
    ctx.cookies.set('userkey', '', {
      expires: new Date(0)
    })
  },

  getUserDetail: async username => {
    let userDetail
    let options = {
      username: decodeURIComponent(username)
    }

    await Db.find(options, function(err, docs) {
      userDetail = docs[0]
    })

    return userDetail
  },

  userSignUp: async (username, password) => {
    let options = {
      username: username,
      password: password
    }

    await Db.create(options)
  }
}

module.exports = UserModel