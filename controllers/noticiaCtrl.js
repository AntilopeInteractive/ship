'use strict'

const Noticia = require('../models/noticia')

function agregarNoticia(req, res) {
  const noticia = new Noticia()
  noticia.titulo = req.body.titulo
  noticia.noticia = req.body.noticia
  noticia.foto = req.body.foto
  noticia.id = 1

  Noticia.findOne({id: 1}, (err, not) => {
    if (err) {
      console.log(err)
    }
    if (!not) {
      noticia.save((err, save) => {
        if (err) {
          console.log(err)
        }
        res.send({
          mensaje: 'Noticia Actualizada'
        })
      })
    }
    if (not) {
      not.titulo = req.body.titulo
      not.noticia = req.body.noticia
      not.foto = req.body.foto
      not.save((err, sav) => {
        if (err) {
          console.log(err)
        }
        res.send({
          mensaje: 'Noticia Actualizada'
        })
      })
    }
  })
}

function cargarNoticia(req, res) {
  Noticia.findOne({id: 1}, (err, noti) => {
    if (err) {
      console.log(err)
    }
    res.send({
      noticia: noti
    })
  })
}
module.exports = {
  agregarNoticia,
  cargarNoticia
}
