'use strict'

const Matriz = require('../models/matriz')

function getMatriz(req, res) {
  Matriz.find({}, function(error, user)
  {
    if (user)
    {
      return res.status(200).send(user);
    }

    if (!user)
    {
      return res.status(400).send({
        message: 'Error al llamar a la matriz'
      });
    }
  });
}

module.exports = {
  getMatriz
}
