'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CalificacionSchema = Schema({
  idVendedor: String,
  idComprador: String,
  precio: Number,
  fecha: Date,
  btc: Number,
  count: Number,
  calificado: String
})

module.exports = mongoose.model('Calificacion', CalificacionSchema)
