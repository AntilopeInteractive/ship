'use strict'

const nodemailer = require('nodemailer')
const Transferencias = require('../models/transferencias.js')
const Pagos = require('../models/pagos.js')
const Tokens = require('../models/tokens.js')
const Usuario = require('../models/usuario.js')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'juancamilovaes@gmail.com', // Your email id
        pass: '1620070329393227NOjucavaesFX' // Your password
    }
})

let textoCorreo
let idToken
function generarToken(req, res) {
  const hora = Date.now()
  const token  = new Tokens({
    estado: 1,
    tipo: req.body.tipo,
    hora: hora
  })
  token.save((err, tokens) => {
    if(err) {
      console.log(err)
    }
    console.log(tokens)
    idToken = tokens._id
    if (req.body.tipo === 1) {
      textoCorreo = 'Transferencia de Bitcoins'
    } else {
      textoCorreo = 'Solicitud de Pago'
    }
    enviarCorreoToken()
  })
  function enviarCorreoToken() {
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Ship-BTC <pruebasantilope@hotmail.com>', // sender address
        to: req.body.correoElectronico, // list of receivers
        subject: 'Token para ' + textoCorreo, // Subject line
        text: textoCorreo, // plaintext body
        html: '<p>Token para ' + textoCorreo + ': <b>' + idToken + '</b></p>'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return res.status(200).send({
          message: 'Error al enviar token al correo electrónico, por favor solicite un nuevo token',
          codigo: 1
        })
      }
      return res.status(200).send({
        message: 'Token enviado a su correo electrónico, recuerde que dispone de 5 minutos para hacer uso de este',
        codigo: 0
      })
    })
  }
}

function realizarTransferencia(req, res) {
  Tokens.findOne({_id: req.body.token, tipo: 1}, (err, token) => {
    if (err) {
      console.log(err)
    }
    if (!token) {
      res.status(200).send({
        codigo: 1,
        message: 'No se ha encontrado un token activo con este codigo, por favor solicite un nuevo token'
      })
    }
    if (token) {
      Usuario.findOne({idUsuario: req.body.idUsuarioTransferencia}, (err, user) => {
        if (err) {
          console.log(err)
        }
        if (!user) {
          res.status(200).send({
            codigo: 1,
            message: 'El Id de usuario ingresado no se encuentra en nuestra base de datos'
          })
        }
        if (user) {
          user.billetera.bitcoins += parseFloat(req.body.dolarTransferido)
          user.billetera.totalHistorico += parseFloat(req.body.dolarTransferido)
          user.save((err, ok) => {
            if (err) {
              console.log(err)
            }
            Usuario.findOne({idUsuario: req.body.idUsuario}, (err, username) => {
              if (err) {
                console.log(err)
              }
              username.billetera.bitcoins -= parseFloat(req.body.dolarTransferido)
              username.save((err, success) => {
                if (err) {
                  console.log(err)
                }
                const folio = req.body.token.substring(4, 12)
                const nuevaTransferencia = new Transferencias({
                  folio: folio,
                  idUsuario: req.body.idUsuario,
                  idUsuarioTransferencia: req.body.idUsuarioTransferencia,
                  dolarTransferido: req.body.dolarTransferido,
                  precioBitcoin: req.body.precioBitcoin,
                  comision: 0,
                  fecha: req.body.fecha
                })
                nuevaTransferencia.save((err, exitosa) => {
                  if (err) {
                    console.log(err)
                  }
                  token.remove((err, eliminado) => {
                    if (err) {
                      console.log(err)
                    }
                    Transferencias.find({idUsuario: req.body.idUsuario}, (err, data) => {
                      if (err) {
                        console.log(err)
                      }
                      res.status(200).send({
                        codigo: 0,
                        user: username,
                        transferencias: data,
                        message: 'Transeferecia exitosa'
                      })
                    })
                  })
                })
              })
            })
          })
        }
      })
    }

  })
}

function solicitarPago(req, res) {
  Tokens.findOne({_id: req.body.token, tipo: 2}, (err, token) => {
    if (err) {
      console.log(err)
    }
    if (!token) {
      res.status(200).send({
        codigo: 1,
        message: 'No se ha encontrado un token activo con este codigo, por favor solicite un nuevo token'
      })
    }parseFloat(req.body.btcPago * req.body.btcPrecio).toFixed(10)
    if (token) {
      const folio = req.body.token.substring(4, 12)
      const cuota = parseFloat(req.body.dolarPago * 0.05).toFixed(10)
      const totalDolar = req.body.dolarPago - cuota
      const btcPago =  parseFloat(totalDolar / req.body.btcPrecio).toFixed(10)

      const pago = new Pagos({
        idUsuario: req.body.idUsuario,
        correoElectronico: req.body.correoElectronico,
        folio: folio,
        dolarPago: totalDolar,
        cuota: cuota,
        btcPago: btcPago,
        btcPrecio: req.body.btcPrecio,
        idBilletera: req.body.idBilletera,
        codigoBilletera: req.body.codigoBilletera,
        fecha: req.body.fecha,
        estado: req.body.estado
      })
      pago.save((err, guardad) => {
        if (err) {
          console.log(err)
        }
        token.remove((err, eliminado) => {
          if (err) {
            console.log(err)
          }
          Pagos.find({idUsuario: req.body.idUsuario}, (err, pagos) => {
            if (err) {
              console.log(err)
            }
            res.status(200).send({
              codigo: 0,
              message: 'Su solicitud de pago esta en proceso',
              pagos: pagos
            })
          })
        })
      })
    }
  })
}

function generarPago(req, res) {
  let textoEstado
  let cancelado
  Pagos.findOne({_id: req.body._id}, (err, pago) => {
    if (err) {
      console.log(err)
    }
    pago.estado = req.body.estado
    pago.save((err, guardado) => {
      if (err) {
        console.log(err)
      }
      if (req.body.estado === 2) {
        Usuario.findOne({idUsuario: req.body.idUsuario}, (err, user) => {
          if (err) {
            console.log(err)
          }
          if (user.billetera.bitcoins < req.body.dolarPago) {
            res.status(200).send({
              message: 'El usuario no cuenta con fondos suficientes para este pago',
              estado: 1
            })
          } else {
            const descuento = req.body.dolarPago + req.body.cuota
            user.billetera.bitcoins -= descuento
            user.save((err, descontado) => {
              if (err) {
                console.log(err)
              }
              Usuario.findOne({idUsuario: 'SHIP'}, (err, ship) => {
                if (err) {
                  console.log(err)
                }
                ship.billetera.totalHistorico += req.body.cuota
                ship.billetera.bitcoins += req.body.cuota
                ship.save((err, shipActualizado) => {
                  if (err) {
                    console.log(err)
                  }
                  textoEstado = 'aprobado'
                  cancelado = 1
                  retornarPagos()
                })
              })
            })
          }
        })
      } else {
        textoEstado = 'denegado'
        cancelado = 0
        retornarPagos()
      }
    })
  })

  function retornarPagos() {
    Pagos.find({}, (err, pagos) => {
      if (err) {
        console.log(err)
      }
      const mensaje = `El pago fue ${textoEstado} con exito`
      res.status(200).send({
        message: mensaje,
        pagos: pagos,
        estado: 0,
        cancelado: cancelado
      })
    })
  }
}

function mensajeCancelado(req, res) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: 'Ship-BTC <pruebasantilope@hotmail.com>', // sender address
      to: req.body.correoElectronico, // list of receivers
      subject: 'Solicitud de pago rechazada', // Subject line
      text: '', // plaintext body
      html: '<div>' +
        '<p style="font-weight: bold;">Su solicitud de pago fue rechazada por el siguiente motivo: ' + '</p>' +
        '<p>' + req.body.mensaje + '</p>' +
      '</div>'
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error)
    }
    return res.status(200).send({
      message: 'mensjae enviado'
    })
  })
}

module.exports = {
  generarToken,
  realizarTransferencia,
  solicitarPago,
  generarPago,
  mensajeCancelado
}
