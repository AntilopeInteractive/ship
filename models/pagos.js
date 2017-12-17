'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PagosSchema = Schema({
  idUsuario: String,
  correoElectronico: String,
  folio: String,
  dolarPago: Number,
  cuota: Number,
  btcPago: Number,
  btcPrecio: Number,
  idBilletera: String,
  codigoBilletera: String,
  fecha: Date,
  estado: Number
})

module.exports = mongoose.model('Pagos', PagosSchema)
