'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokensSchema = Schema({
  estado: Number,
  tipo: Number,
  hora: Number 
})

module.exports = mongoose.model('Tokens', TokensSchema)
