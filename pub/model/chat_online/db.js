const config = require('../../db').chat_online
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  password: String
})

let User = mongoose.model('users', userSchema)

const Db = {
  connect: async () => {
    mongoose.connect(`${config.host}:${config.port}/${config.db}`, {
      useNewUrlParser: true
    })
  },

  disconnect: async () => {
    mongoose.disconnect()
  },

  find: async (options, callback) => {
    return User.find(options, callback)
  },

  create: async (options, callback) => {
    return User.create(options, callback)
  }
}

module.exports = Db