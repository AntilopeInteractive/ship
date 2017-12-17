'use strict'

const Preguntas = require('../models/preguntas')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'juancamilovaes@gmail.com', // Your email id
        pass: '1620070329393227NOjucavaesFX' // Your password
    }
})

function agregarPregunta(req, res) {
  const pregunta = new Preguntas()
  pregunta.pregunta = req.body.pregunta
  pregunta.respuesta = req.body.respuesta

  pregunta.save((err, guardada) => {
    if (err) {
      console.log(err)
    }
    Preguntas.find({}, (err, preguntas) => {
      if (err) {
        console.log(err)
      }
      res.send({
        preguntas: preguntas
      })
    })
  })
}
function eliminarPregunta(req, res) {
  console.log(req.body)
  Preguntas.findOne({_id: req.body.id}, (err, pregunta) => {
    if (err) {
      console.log(err)
    }
    pregunta.remove((err, eliminado) => {
      if (err) {
        console.log(err)
      }
      Preguntas.find({}, (err, preguntas) => {
        if (err) {
          console.log(err)
        }
        res.send({
          preguntas: preguntas
        })
      })
    })
  })
}
function editarPregunta(req, res) {
  Preguntas.findOne({_id: req.body.id}, (err, pregunta) => {
    if (err) {
      console.log(err)
    }
    pregunta.pregunta = req.body.pregunta
    pregunta.respuesta = req.body.respuesta
    pregunta.save((err, editada) => {
      if (err) {
        console.log(err)
      }
      Preguntas.find({}, (err, preguntas) => {
        if (err) {
          console.log(err)
        }
        res.send({
          preguntas: preguntas
        })
      })
    })

  })
}

function enviarPregunta(req, res) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: 'Ship-BTC <pruebasantilope@hotmail.com>', // sender address
      to: 'juanca@idealo.com.co', // list of receivers
      subject: 'Pregunta' + ' ' + 'de' + ' ' + req.body.idUsuario, // Subject line
      text: '', // plaintext body
      html: '<div>' +
        '<p><b>Nombre:</b> '  + req.body.nombres + ' ' + req.body.apellidos +'</p>' +
        '<p><b>Correo Electrónico:</b> '  + req.body.correoElectronico + '</p>' +
        '<p><b>Teléfono:</b> ' + req.body.telefonoCelular + '</p>' +
        '<p><b>Pregunta:</b> ' + req.body.pregunta + '</p>' +
      '</div>'
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error)
    }
    res.status(200).send({
      mensaje: 'Pregunta enviada con éxito, pronto la estaremos respondiendo'
    })
  })
}
module.exports = {
  agregarPregunta,
  eliminarPregunta,
  editarPregunta,
  enviarPregunta
}
