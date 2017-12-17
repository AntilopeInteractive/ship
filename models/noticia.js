'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NoticiaSchema = Schema({
  titulo: String,
  noticia: String,
  foto: String,
  id: Number
})

module.exports = mongoose.model('Noticia', NoticiaSchema)
