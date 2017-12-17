'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfiguracionSchema = Schema({
  valorInscripcion: Number,
  id: Number
})

module.exports = mongoose.model('Configuracion', ConfiguracionSchema)
