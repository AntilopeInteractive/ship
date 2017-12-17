'use strict'
const nodemailer = require('nodemailer')
const Usuario = require('../models/usuario')
const Matriz = require('../models/matriz')
const Configuracion = require('../models/configuracion')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'juancamilovaes@gmail.com', // Your email id
        pass: '1620070329393227NOjucavaesFX' // Your password
    }
});

function registroShip(req,res)
{
  var codigoCedula = 0
  var codigoPatrocinador = 0
  var codigoIdUsuario = 0
  var errores = []

  var matrizC = []
  var codigosAEncontrar = []
  var cantidadPadre = 0
  var nivel = 0
  var nuevoNivel = 0

  var idPat = req.body.patrocinador
  var idUsu = req.body.idUsuario
  Usuario.findOne({idUsuario: idPat}, function(error, user)
  {
    if (error)
    {
      res.status(500).send({
        message: 'Error interno del servidor'
      })
    }
    if (user)
    {
      codigoPatrocinador = 0
      buscarIdUsuario()
    }

    if (!user)
    {
      codigoPatrocinador = 1
      var error = {
        id: 11,
        texto: 'El Id del patrocinador no se encuentra en nuestra base de datos'
      }
      errores.push(error)
      buscarIdUsuario()
      // return res.status(200).send({
      //   message: 'El Id del patrocinador no se encuentra en nuestra base de datos',
      //   codigo: 1
      // })
    }
  })

  function buscarIdUsuario() {
    var idUser = req.body.idUsuario
    Usuario.findOne({idUsuario: idUser}, function(error, user)
    {
      if (error)
      {
        res.status(500).send({
          message: 'Error interno del servidor'
        })
      }
      if (!user)
      {
        codigoIdUsuario = 0
        buscarCedula()
      }
      if (user)
      {
        codigoIdUsuario = 1
        var error = {
          id: 12,
          texto: 'El Id de usuario ya se encuentra registrado por favor ingresa otro'
        }
        errores.push(error)
        buscarCedula()
        // return res.status(200).send({
        //   message: 'El Id de usuario ya se encuentra registrado por favor ingresa otro',
        //   codigo: 2
        // })
      }
    })
  }

  function buscarCedula() {
    Usuario.find({documentoIdentidad: req.body.documentoIdentidad}, function(error, user)
    {
     console.log(user.length)
     if (error)
      {
        res.status(500).send({
          message: 'Error interno del servidor'
        })
      }
      if (!user)
      {
        codigoCedula = 0
        validarCodigos()
      }
      if (user.length < 10)
      {
        codigoCedula = 0
        validarCodigos()
      }
      if (user.length == 10)
      {
        codigoCedula = 1
        var error = {
          id: 13,
          texto: 'La cédula de ciudadanía ingresada ya ha llegado al limite de registros permitidos'
        }
        errores.push(error)
        validarCodigos()
        // return res.status(200).send({
        //   message: 'La cédula de ciudadanía ingresada ya ha llegado al limite de registros permitidos',
        //   codigo: 3
        // })
      }
    })
  }

  function validarCodigos()
  {
    if (codigoCedula == 1 || codigoPatrocinador == 1 || codigoIdUsuario == 1) {
      return res.status(200).send({
        message: errores,
        codigo: 1
      })
    }

    else {
      traerMatriz()
    }
  }

  function traerMatriz() {
    Matriz.find({}, function(error, matriz)
  	{
  		if (matriz)
  		{
  			matrizC = matriz
        console.log(matrizC);
        buscarPatrocinador()
  		}

  		if (!matriz)
  		{
  			return res.status(400).send({
  			   message: 'Error al llamar a la matriz'
  			})
  		}
  	})
  }

  function buscarPatrocinador(){
    for (var i = 0; i < matrizC.length; i++)
  	{
  		for (var x = 0; x < matrizC[i].usuarios.length; x++)
  		{
  			if (matrizC[i].usuarios[x].idUsuario == idPat)
    		{
    			nivel = matrizC[i].nivel
    			nuevoNivel = nivel + 1
    		}
  		}
  	}

    for (var a = 0; a < matrizC.length; a++)
  	{
    	if (matrizC[a].nivel == nuevoNivel)
    	{
    		if (matrizC[a].usuarios.length != 0)
    		{
    			for (var y = 0; y < matrizC[a].usuarios.length; y++)
    			{
    				if (matrizC[a].usuarios[y].idPadre == idPat)
    				{
    					cantidadPadre += 1
    					codigosAEncontrar.push(matrizC[a].usuarios[y].idUsuario)
    				}
    			}
    		}
    	}
  	}
    encontrarPatrocinador(nuevoNivel)
  }

  function encontrarPatrocinador(nivel)
  {
    var largoMaximo = Math.pow(2, nivel-1);

    for (var i = 0; i < matrizC.length; i++)
    {
      if (matrizC[i].nivel == nivel)
      {
        if (matrizC[i].usuarios.length < largoMaximo && cantidadPadre < 2)
        {
          var nuevoUsuarioMatriz =
          {
            idUsuario: idUsu,
            idPatrocinador: idPat,
            idPadre: idPat
          }

          var idNivelMatriz = matrizC[i]._id

          registroMatriz(nuevoUsuarioMatriz, idNivelMatriz)
        }

        else if (matrizC[i].usuarios.length < largoMaximo && cantidadPadre == 2)
        {
          nuevoNivel = nivel+1
          buscarNuevoPatrocinador(nuevoNivel)
        }

        else
        {
          nuevoNivel = nivel+1
          buscarNuevoPatrocinador(nuevoNivel)
        }
      }
    }
  }

  function buscarNuevoPatrocinador(nivel)
  {
    var largoMaximo = Math.pow(2, nivel-1)
    var cantidadEncontrada = 0
    var valorIndividual = 0
    var nuevosCodigosEncontrar = []
    var cantidadesEncontradas = []
    var posicion = 0

    for (var i = 0; i < matrizC.length; i++)
    {
      if (matrizC[i].nivel == nivel)
      {
        if (matrizC[i].usuarios.length > 0)
        {
          for (var b = 0; b < codigosAEncontrar.length; b++)
          {
            for (var a = 0; a < matrizC[i].usuarios.length; a++)
            {
              if (matrizC[i].usuarios[a].idPadre == codigosAEncontrar[b])
              {
                cantidadEncontrada += 1
                valorIndividual += 1
                nuevosCodigosEncontrar.push(matrizC[i].usuarios[a].idUsuario)
              }

              if (a == matrizC[i].usuarios.length-1)
              {
                cantidadesEncontradas.push(valorIndividual)
                valorIndividual = 0
              }
            }
          }
        }

        if (matrizC[i].usuarios.length == 0)
        {
          var nuevoUsuarioMatriz =
          {
            idUsuario: idUsu,
            idPatrocinador: idPat,
            idPadre: codigosAEncontrar[0]
          }

          var idNivelMatriz = matrizC[i]._id

          registroMatriz(nuevoUsuarioMatriz, idNivelMatriz)

          codigosAEncontrar = []
          cantidadPadre = 0
          cantidadesEncontradas = []
          cantidadEncontrada = 0
          valorIndividual = 0
          nuevosCodigosEncontrar = []
        }
      }
    }

    if (cantidadesEncontradas.length > 0)
    {
      var suma = 0
      for (var c = 0; c < cantidadesEncontradas.length; c++)
      {
        if (cantidadesEncontradas[c] == 2)
        {
          suma += 1
        }
      }

      if (suma == codigosAEncontrar.length)
      {
        codigosAEncontrar = []
        codigosAEncontrar = nuevosCodigosEncontrar
        funcionIntermedia(nivel)
      }

      else
      {
        for (var d = 0; d < matrizC.length; d++)
        {
          if (matrizC[d].nivel == nivel)
          {
            var codigoPadre = ""
            var indice = cantidadesEncontradas.indexOf(0)
            if (indice == -1)
            {
              indice = cantidadesEncontradas.indexOf(1)
              codigoPadre = codigosAEncontrar[indice]
            }

            else
            {
              codigoPadre = codigosAEncontrar[indice]
            }

            var nuevoUsuarioMatriz =
            {
              idUsuario: idUsu,
              idPatrocinador: idPat,
              idPadre: codigoPadre
            }

            var idNivelMatriz = matrizC[d]._id

            registroMatriz(nuevoUsuarioMatriz, idNivelMatriz)

            codigosAEncontrar = []
            cantidadPadre = 0
            cantidadesEncontradas = []
            cantidadEncontrada = 0
            valorIndividual = 0
            nuevosCodigosEncontrar = []
          }
        }
      }
    }
  }

  function funcionIntermedia(nivel)
  {
    var otroNivel = nivel+1;
    buscarNuevoPatrocinador(otroNivel);
  }
  let idPadre
  function registroMatriz(nuevoUsuarioMatriz,idNivelMatriz){

    Matriz.findOne({_id: idNivelMatriz}, function(err, foundObject){
  		if (err) {
  			console.log(err)
  			res.status(500).send({
  			   message: 'Error al registrar en la matriz'
  			});
  		} else {
  			if (!foundObject) {
  				res.status(404).send({
  				   message: 'Error al registrar en la matriz'
  				});
  			}
        else {
          foundObject.usuarios.push(nuevoUsuarioMatriz)

  				foundObject.save(function(err, updatedObject) {
  					if (err) {
  						console.log(err);
  						res.status(500).send({
  						   message: 'Error al registrar en la matriz'
  						});
  					} else {
              idPadre = nuevoUsuarioMatriz.idPadre
  						registro(nuevoUsuarioMatriz)
  					}
  				})
  			}
  		}
	  })
  }

  function registro(nuevoUsuarioMatriz) {

    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre")
  	var fecha = new Date()
  	var fechaAddinscripcion = meses[fecha.getMonth()] + " " + fecha.getDate()  +  ", " + fecha.getFullYear()

    let nuevoUsuario = new Usuario()
    nuevoUsuario.patrocinador = req.body.patrocinador
    nuevoUsuario.padre = nuevoUsuarioMatriz.idPadre
    nuevoUsuario.idUsuario = req.body.idUsuario
    nuevoUsuario.documentoIdentidad = req.body.documentoIdentidad
    nuevoUsuario.nombres = req.body.nombres
    nuevoUsuario.apellidos = req.body.apellidos
    nuevoUsuario.fechaDeNacimiento = req.body.fechaDeNacimiento
    nuevoUsuario.paisResidencia = req.body.paisResidencia
    nuevoUsuario.ciudadResidencia = req.body.ciudadResidencia
    nuevoUsuario.direccion = req.body.direccion
    nuevoUsuario.codigoPostal = req.body.codigoPostal
    nuevoUsuario.correoElectronico = req.body.correoElectronico
    nuevoUsuario.contrasena = req.body.contrasena
    nuevoUsuario.telefonoCelular = req.body.telefonoCelular
    nuevoUsuario.fechaInscripcion = req.body.fechaInscripcion
    nuevoUsuario.aceptaTerminoCondiciones = true
    nuevoUsuario.aceptaContrato = true
    nuevoUsuario.fechaRenovacion = ''
    nuevoUsuario.estado = 'inactivo'
    nuevoUsuario.calificaciones = 0
    nuevoUsuario.legal = {
     cargaReciente: 'no',
     rutaDocumentoIdentidad: '',
     estadoDocumentoIdentidad: 'Pendiente',
     extensionDocumentoIdentidad: '',
     estadoDocumentoIdentidad: 'Pendiente',
     rutaServiciosPublicos: '',
     extensionServiciosPublicos: '',
     estadoServiciosPublicos: 'Pendiente'
   },
   nuevoUsuario.billetera = {
     estado: "Inactivo",
     totalHistorico: 0,
     bitcoins: 0,
     compraVenta: [],
     bonoDirecto: 0,
     bonoEquipo: 0,
     bonoCompensatorio: 0,
     mensajes: [{
      idMensaje: 0,
      fechaMensaje: fechaAddinscripcion,
      tipoMensaje: "Alerta",
      texto: "Aún no has realizado tu primera compra"
     }]
   }
   nuevoUsuario.foto = ''

   console.log(Usuario)
   nuevoUsuario.save((err, usuarioRegistrado) => {
      if (err) {
        res.status(500).send({
          message: 'Error interno del servidor'
        })
      }
      // enviarCorreoRegistro()
      cargarConfiguracion(nuevoUsuario.patrocinador)
   })
  }
  let valorInscripcion
  function cargarConfiguracion(idPatrocinador) {
    Configuracion.findOne({id: 0}, (err, config) => {
      if (err) {
        console.log(err)
      }
      valorInscripcion = config.valorInscripcion
      actualizarPrimerBono(idPatrocinador)
    })
  }

  function actualizarPrimerBono(idPatrocinador) {
    let comision = valorInscripcion * 0.1
    Usuario.findOne({idUsuario: idPatrocinador}, (err, user) => {
      if (err) {
        console.log(err)
      }
      let totalHistorico = user.billetera.totalHistorico + comision
      let bonoDirecto = user.billetera.bonoDirecto + comision
      let bitcoins = user.billetera.bitcoins + comision
      user.billetera.totalHistorico = totalHistorico
      user.billetera.bonoDirecto = bonoDirecto
      user.billetera.bitcoins = bitcoins
      user.save((err, guardado) => {
        if (err) {
          console.log(err)
        }
        if (idPatrocinador === 'SHIP') {
          actualizarSegundoBono()
        } else {
          Usuario.findOne({idUsuario: user.patrocinador}, (err, pat) => {
            if (err) {
              console.log(err)
            }
            // let nuevaComision = comision * 0.1
            let nuevaComision = 0.1
            let totalHistorico = pat.billetera.totalHistorico + nuevaComision
            let bonoCompensatorio = pat.billetera.bonoCompensatorio + nuevaComision
            let bitcoins = pat.billetera.bitcoins + nuevaComision
            pat.billetera.totalHistorico = totalHistorico
            pat.billetera.bonoCompensatorio = bonoCompensatorio
            pat.billetera.bitcoins = bitcoins
            pat.save((err, guardado) => {
              if (err) {
                console.log(err)
              }
              actualizarSegundoBono()
            })
          })
        }
      })
    })
  }

  let nivelMatriz = 1
  function actualizarSegundoBono() {
    console.log(idPadre);
    console.log(nivelMatriz);
    if (nivelMatriz < 15) {
      Usuario.findOne({idUsuario: idPadre}, (err, padre) => {
        if (err) {
          console.log(err)
        }
        let totalHistorico = padre.billetera.totalHistorico + 1
        let bonoEquipo = padre.billetera.bonoEquipo + 1
        let bitcoins = padre.billetera.bitcoins + 1
        padre.billetera.totalHistorico = totalHistorico
        padre.billetera.bonoEquipo = bonoEquipo
        padre.billetera.bitcoins = bitcoins
        padre.save((err, guardado) => {
          if (err) {
            console.log(err)
          }
          if (idPadre === 'SHIP') {
            enviarCorreoRegistro()
          } else {
            idPadre = padre.padre
            nivelMatriz += 1
            actualizarSegundoBono()
          }
        })
      })
    } else {
      enviarCorreoRegistro()
    }
  }
  function enviarCorreoRegistro() {
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Ship-BTC <pruebasantilope@hotmail.com>', // sender address
        to: req.body.correoElectronico, // list of receivers
        subject: 'Bienvenido a Ship-BTC', // Subject line
        text: 'Bienvenido a Ship-BTC', // plaintext body
        html: '<p>Registro Completo de: '+ req.body.idUsuario +' </p>'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return res.status(200).send({
          message: 'Usuario Registrado',
          codigo: 0
        })
      }
      return res.status(200).send({
        message: 'Usuario Registrado',
        codigo: 0
      })
      console.log('Message sent: ' + info.response);
    })
  }
}


module.exports = {
  registroShip
}
