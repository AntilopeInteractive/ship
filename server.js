'use strict'

const mongoose = require('mongoose')
// const crypto = require('crypto')
const app = require('./app')
const port = process.env.PORT || 3000

// mongodb://ship-btc:ship@ds151431.mlab.com:51431/ship-btc
mongoose.connect('mongodb://127.0.0.1:27017/ship', (err, res) => {
  if (err) {
    return console.log(`error al conectar a la base de datos: ${err}`)
  }

  app.listen(port, () => {
    console.log(`servidor Ship-BTC ${port}`)
  })
})
