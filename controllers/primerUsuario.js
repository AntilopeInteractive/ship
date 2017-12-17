'use strict'
const crypto = require('crypto')
const Usuario = require('../models/usuario')
const Matriz = require('../models/matriz')
const Configuracion = require('../models/configuracion')

function encriptar(user, pass) {
  var hmac = crypto.createHmac('sha1', user).update(pass).digest('hex')
  return hmac;
}

function primerUser (req, res) {
  var UsuarioInicial = new Usuario(
  {
   idUsuario: "SHIP",
   nombres: "JUAN CAMILO TURMEQUE",
   documentoIdentidad: 1026254869,
   paisResidencia: "Colombia",
   ciudadResidencia: "Bogotá",
   direccion: "Carrera 18A # 39B-32",
   correoElectronico: "juanca@idealo.com.co",
   contrasena: "1026254869",
   calificaciones: 5,
   billetera: {
     estado: 'Activo',
     totalHistorico: 0,
     bitcoins: 0,
     compraVenta: [],
     bonoDirecto: 0,
     bonoEquipo: 0,
     bonoCompensatorio: 0,
     mensajes: [{
      idMensaje: 0,
      tipoMensaje: 'Aprobado',
      texto: 'Billetera en estado original'
     }]
   }
  });

  Usuario.findOne({idUsuario: "SHIP"}, function(err,user)
  {
   if (user)
   {
    res.status(200).send({mensaje: 'existe'})
   }

   else
   {
    // var passEncriptada = encriptar(UsuarioInicial.idUsuario, UsuarioInicial.contrasenaUsuario);
    // UsuarioInicial.contrasenaUsuario = passEncriptada;
    UsuarioInicial.save((err, guardado) => {
      if (err) {
        console.log(err)
      }
      res.status(200).send({mensaje: 'guardado'})
    });
   }
  })
  // matriz
  var matriz = new Matriz(
  {
   nivel: 1,
   usuarios: [{
    idUsuario: "SHIP",
    calificacion: 5
   }]
  });

  Matriz.findOne({nivel: 1}, function(err,user)
  {
   if (user)
   {
    console.log("Matriz Existe");
   }

   else
   {
    matriz.save();
    console.log("Matriz Creada");
   }
  })

  Matriz.findOne({nivel: 2}, function(err,user)
  {
   if (user)
   {
    console.log("Nivel Existe");
   }

   else
   {
    ingresarOtrosNivelesMatriz();
   }
  })

  function ingresarOtrosNivelesMatriz()
  {
   var i = 2
   while (i <= 100) {
    var objetoNivel = new Matriz({
     nivel: i,
     usuarios: []
    })

    objetoNivel.save();
    i += 1;
    console.log("Nivel Creado");
   }
   configuracionInicial()
  }
  function configuracionInicial() {
    Configuracion.findOne({id: 0}, (err, config) => {
      if (config) {
        console.log('configuracion existe');
      } else {
        let configuracionNueva = new Configuracion({
          id: 0,
          valorInscripcion: 20
        })
        configuracionNueva.save()
      }
    })
  }
}

module.exports = {
  primerUser
}
