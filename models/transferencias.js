'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransferenciasSchema = Schema({
  idUsuario: String,
  idUsuarioTransferencia: String,
  folio: String,
  precioBitcoin: Number,
  tipo: Number,
  dolarTransferido: Number,
  fecha: Date
})

module.exports = mongoose.model('Transferencias', TransferenciasSchema)
