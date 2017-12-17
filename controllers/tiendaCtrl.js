'use strict'

const Tienda = require('../models/tienda')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'juancamilovaes@gmail.com', // Your email id
        pass: '1620070329393227NOjucavaesFX' // Your password
    }
})

function registroVenta (req, res) {
  let nuevoVenta = new Tienda()
  nuevoVenta.idUsuario = req.body.idUsuario
  nuevoVenta.btcVenta = req.body.btcVenta
  nuevoVenta.btcPrecio = req.body.btcPrecio
  nuevoVenta.nombres = req.body.nombres
  nuevoVenta.apellidos = req.body.apellidos
  nuevoVenta.paisResidencia = req.body.paisResidencia
  nuevoVenta.correoElectronico = req.body.correoElectronico
  nuevoVenta.contrasena = req.body.contrasena
  nuevoVenta.aceptaTerminoCondiciones = true
  nuevoVenta.fechaPublicacion = Date.now()
  nuevoVenta.calificaciones = req.body.calificaciones
  nuevoVenta.foto = ''
  nuevoVenta.cantidadCalificaciones = req.body.cantidadCalificaciones
 nuevoVenta.save((err, ventaRegistrado) => {
   if (err) {
     console.log(err)
   }
   res.status(200).send({
     message: 'Venta Registrada'
   })
 })
}

function getTienda (req, res) {
  Tienda.find((err, tienda) => {
    if (err) {
      console.log(err)
    }
    res.json(tienda)
  })
}

function enviarCorreoVendedor(req, res) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: 'Ship-BTC <pruebasantilope@hotmail.com>', // sender address
      to: req.body.correoElectronicoVendedor, // list of receivers
      subject: 'Alguien esta interesado en tus bitcoins', // Subject line
      text: '', // plaintext body
      html: '<div>' +
        '<p>Correo Electrónico: '  + req.body.correoElectronicoComprador + '</p>' +
        '<p>Teléfono: ' + req.body.telefonoCelularComprador + '</p>' +
        '<p>Mensaje: ' + req.body.MensajeVendedor + '</p>' +
      '</div>'
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error)
    }
    Tienda.findOne({_id: req.body.id}, (err, data) => {
      if (err) {
        console.log(err)
      }
      data.ofertantes.push(req.body.idComprador)
      data.save((err, guardado) => {
        if (err) {
          console.log(err)
        }
        return res.status(200).send({
          message: 'Tus datos fueron enviados al vendedor'
        })
      })
    })
  })
}

function eliminarVenta(req, res) {
  Tienda.findOne({_id: req.body.id}, (err, venta) => {
    if (err) {
      console.log(err)
    }
    venta.remove((err, eliminado) => {
      if (err) {
        console.log(err)
      }
      Tienda.find({idUsuario: req.body.idUsuario}, (err, ventas) => {
        if (err) {
          console.log(err)
        }
        res.send({
          mensaje: 'Venta eliminada con exito',
          ventas: ventas
        })
      })
    })
  })
}

module.exports = {
  registroVenta,
  getTienda,
  enviarCorreoVendedor,
  eliminarVenta
}
