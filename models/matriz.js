'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MatrizSchema = Schema({
  nivel: Number,
  usuarios: [
    {
      idUsuario: String,
      idPatrocinador: String,
      idPadre: String,
      calificacion: Number
    }
  ]
})

module.exports = mongoose.model('Matriz', MatrizSchema)
