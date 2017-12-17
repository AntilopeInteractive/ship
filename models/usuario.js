'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UsuarioSchema = Schema({
  foto: String,
  patrocinador: String,
  padre: String,
  idUsuario: String,
  documentoIdentidad: Number,
  nombres: String,
  apellidos: String,
  fechaDeNacimiento: Date,
  paisResidencia: String,
  ciudadResidencia: String,
  direccion: String,
  codigoPostal: String,
  correoElectronico: String,
  contrasena: String,
  telefonoCelular: Number,
  aceptaTerminoCondiciones: String,
  aceptaContrato: String,
  fechaInscripcion: Date,
  fechaRenovacion: Date,
  estado: String,
  calificaciones: Number,
  comentarios: [],
  legal: {
   cargaReciente: String,
   rutaDocumentoIdentidad: String,
   extensionDocumentoIdentidad: String,
   estadoDocumentoIdentidad: String,
   rutaServiciosPublicos: String,
   extensionServiciosPublicos: String,
   estadoServiciosPublicos: String
  },
  billetera: {
   estado: String,
   totalHistorico: Number,
   bitcoins: Number,
   compraVenta: [
    {
      tipo: String,
      valor: Number,
      fecha: Date
    }
   ],
   bonoDirecto: Number,
   bonoEquipo: Number,
   bonoCompensatorio: Number,
   mensajes: [{
    idMensaje: Number,
    fechaMensaje: String,
    tipoMensaje: String,
    texto: String
   }]
  }
})

module.exports = mongoose.model('Usuario', UsuarioSchema)
