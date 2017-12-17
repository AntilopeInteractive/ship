'use strict'

const Usuarios = require('../models/usuario')

function mostrarUsuario(req, res) {
  const user = req.body.user.toUpperCase()
  Usuarios.findOne({idUsuario: user}, (err, usuario) => {
    if (err) {
      console.log(err)
    }
    res.send({
      user: usuario
    })
  })
}

module.exports = {
  mostrarUsuario
}
