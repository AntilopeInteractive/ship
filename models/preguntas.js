'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PreguntasSchema = Schema({
  pregunta: String,
  respuesta: String
})

module.exports = mongoose.model('Preguntas', PreguntasSchema)
