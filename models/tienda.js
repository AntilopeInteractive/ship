'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TiendaSchema = Schema({
  idUsuario: String,
  foto: String,
  nombres: String,
  apellidos: String,
  paisResidencia: String,
  calificaciones: Number,
  btcVenta: Number,
  btcPrecio: Number,
  correoElectronico: String,
  fechaPublicacion: Date,
  ofertantes: [],
  comentarios: [],
  cantidadCalificaciones: Number
})

module.exports = mongoose.model('Tienda', TiendaSchema)
