'use strict'

const Calificacion = require('../models/calificacion')
const Tienda = require('../models/tienda')
const Usuarios = require('../models/usuario')

function agregarCalificacion(req, res) {
  const calificacion = new Calificacion()
  calificacion.idVendedor = req.body.idVendedor
  calificacion.idComprador = req.body.idComprador
  calificacion.precio = req.body.precio
  calificacion.fecha = req.body.fecha
  calificacion.btc = req.body.btc
  calificacion.count = 2
  calificacion.calificado = ''

  calificacion.save((err, guardado) => {
    if (err) {
      console.log(err)
    }
    Tienda.findOne({_id: req.body.id}, (err, venta) => {
      if (err) {
        console.log(err)
      }
      venta.remove((err, eliminado) => {
        if (err) {
          console.log(err)
        }
        Tienda.find({idUsuario: req.body.idVendedor}, (err, ventas) => {
          if (err) {
            console.log(err)
          }
          Calificacion.find({$or:[ {idVendedor:req.body.idVendedor}, {idComprador:req.body.idVendedor}]}, (err, calificaciones) => {
            if (err) {
              console.log(err)
            }
            res.send({
              calificaciones: calificaciones,
              mensaje: 'Puedes ir a calificar esta venta',
              ventas: ventas
            })
          })
        })
      })
    })
  })
}

function calificar(req, res) {
  console.log('entro');
  const comentario = {
    usuario: req.body.usuario,
    comentario: req.body.comentario,
    valorCalificacion: req.body.valorCalificacion
  }
  var sumaCalificacion = Number(0)
  var totalCalificacion
  Usuarios.findOne({idUsuario: req.body.idUsuario}, (err, user) => {
    if (err) {
      console.log(user)
    }
    user.comentarios.push(comentario)
    for (var i = 0; i < user.comentarios.length; i++) {
      console.log(user.comentarios[i].valorCalificacion);
      // console.log(sumaCalificacion);
      sumaCalificacion += parseInt(user.comentarios[i].valorCalificacion)
    }
    console.log(sumaCalificacion)
    totalCalificacion = parseInt(sumaCalificacion / user.comentarios.length)
    user.calificaciones = totalCalificacion
    console.log(totalCalificacion)
    user.save((err, guardado) => {
      if (err) {
        console.log(err)
      }
      Calificacion.findOne({_id: req.body.id}, (err, cal) => {
        if (err) {
          console.log(err)
        }
        if (cal.count === 1) {
          cal.remove((err, borrada) => {
            if (err) {
              console.log(err)
            }
            Calificacion.find({$or:[ {idVendedor:req.body.usuario}, {idComprador:req.body.usuario}]}, (err, calificaciones) => {
              if (err) {
                console.log(err)
              }
              res.send({
                calificaciones:calificaciones
              })
            })
          })
        } else {
          if (cal.idVendedor === req.body.usuario) {
            cal.calificado = cal.idVendedor
            cal.idVendedor = ''
          } else {
            cal.calificado = cal.idComprador
            cal.idComprador = ''
          }
          cal.count = 1
          cal.save((err, actualizada) => {
            if (err) {
              console.log(err)
            }
            Calificacion.find({$or:[ {idVendedor:req.body.usuario}, {idComprador:req.body.usuario}]}, (err, calificaciones) => {
              if (err) {
                console.log(err)
              }
              res.send({
                calificaciones:calificaciones
              })
            })
          })
        }
      })
    })
  })
}

module.exports = {
  agregarCalificacion,
  calificar
}
