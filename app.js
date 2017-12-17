'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const Usuario = require('./models/usuario')
const Tienda = require('./models/tienda')
const primerUsuario = require('./controllers/primerUsuario')
const usuariosCtrl = require('./controllers/manejoUsuarios')
const tiendaCtrl = require('./controllers/tiendaCtrl')
const matrizCtrl = require('./controllers/matrizCtrl')
const transaccionesCtrl = require('./controllers/transaccionesCtrl')
const Tokens = require('./models/tokens')
const Transferencias = require('./models/transferencias')
const Pagos = require('./models/pagos')
const calificacionCtrl = require('./controllers/calificacionCtrl')
const Calificacion = require('./models/calificacion')
const preguntasCtrl = require('./controllers/preguntasCtrl')
const Preguntas = require('./models/preguntas')
const perfilCtrl = require('./controllers/perfilCtrl')
const noticiaCtrl = require('./controllers/noticiaCtrl')
const app = express()


//guardar las sesiones iniciadas
app.use(session({
 resave: true,
 saveUninitialized: true,
 secret:'a4f8071f-c873-4447-8ee2'
}));
app.use(cookieParser())
//usar directorio public con express
app.use(express.static('public'))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
  res.header("Access-Control-Allow-Headers", "Content-Type")
  next()
})
//body parse para convertir en json
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
// rutas
app.get('/primerUser', primerUsuario.primerUser)
app.post('/registroShip', usuariosCtrl.registroShip)
app.post('/registroVenta', tiendaCtrl.registroVenta)
app.get('/getTienda', tiendaCtrl.getTienda)
app.post('/enviarCorreoVendedor', tiendaCtrl.enviarCorreoVendedor)
app.post('/eliminarVenta', tiendaCtrl.eliminarVenta)
app.get('/getMatriz', matrizCtrl.getMatriz)
app.post('/generarToken', transaccionesCtrl.generarToken)
app.post('/realizarTransferencia', transaccionesCtrl.realizarTransferencia)
app.post('/mensajeCancelado', transaccionesCtrl.mensajeCancelado)
app.post('/solicitarPago', transaccionesCtrl.solicitarPago)
app.post('/admin/generarPago', transaccionesCtrl.generarPago)
app.post('/agregarCalificacion', calificacionCtrl.agregarCalificacion)
app.post('/admin/agregarPregunta', preguntasCtrl.agregarPregunta)
app.post('/admin/eliminarPregunta', preguntasCtrl.eliminarPregunta)
app.post('/admin/editarPregunta', preguntasCtrl.editarPregunta)
app.post('/api/enviarPregunta', preguntasCtrl.enviarPregunta)
app.post('/perfil', perfilCtrl.mostrarUsuario)
app.post('/calificar', calificacionCtrl.calificar)
app.post('/agregarNoticia', noticiaCtrl.agregarNoticia)
app.get('/cargarNoticia', noticiaCtrl.cargarNoticia)


//inicializar passport
app.use(passport.initialize())
app.use(passport.session())
//configurar autenticacion
passport.use(new LocalStrategy(function(username, password, done)
{
 //var passEncriptada = encriptar(username,password)
 Usuario.findOne({idUsuario: username, contrasena: password}, function(err, user)
 {
  if (user)
  {
   return done(null, user)
  }

  return done(null, false, {message:'no puede ingresar'})
  })
}))

passport.serializeUser(function(user, done){
  done(null, user)
})
passport.deserializeUser(function(user,done){
  done(null,user)
})
//rutas
app.post('/api/login', passport.authenticate('local'), function(req, res)
{
  res.json(req.user)
})

app.get('/admin/loggedin', function(req, res){
 if (req.isAuthenticated()) {
   Usuario.findOne({idUsuario: req.user.idUsuario}, (err, user) => {
     if (err) {
       console.log(err)
     }
     Pagos.find({}, (err, pagos) => {
       if (err) {
         console.log(err)
       }
       res.status(200).send({
         user: user,
         pagos: pagos
       })
     })
   })
 } else {
   res.send({
     user: false
   })
 }
})

app.get('/api/loggedin', function(req, res){
 if (req.isAuthenticated()) {
   Usuario.findOne({idUsuario: req.user.idUsuario}, (err, user) => {
     if (err) {
       console.log(err)
     }
     Calificacion.find({$or:[ {idVendedor:req.user.idUsuario}, {idComprador:req.user.idUsuario}]}, (err, calificaciones) => {
       if (err) {
         console.log(err)
       }
       res.send({
         user: user,
         calificaciones: calificaciones
       })
     })
   })
 } else {
   res.send({
     user: false
   })
 }
})
app.get('/admin/preguntas', function(req, res){
 if (req.isAuthenticated()) {
   Usuario.findOne({idUsuario: req.user.idUsuario}, (err, user) => {
     if (err) {
       console.log(err)
     }
     Preguntas.find({}, (err, preguntas) => {
       if (err) {
         console.log(err)
       }
       res.send({
         user: user,
         preguntas: preguntas
       })
     })
   })
 } else {
   res.send({
     user: false
   })
 }
})
app.get('/api/loggedinPreguntas', function(req, res){
 if (req.isAuthenticated()) {
   Usuario.findOne({idUsuario: req.user.idUsuario}, (err, user) => {
     if (err) {
       console.log(err)
     }
     Preguntas.find({}, (err, preguntas) => {
       if (err) {
         console.log(err)
       }
       Calificacion.find({$or:[ {idVendedor:req.user.idUsuario}, {idComprador:req.user.idUsuario}]}, (err, calificaciones) => {
         if (err) {
           console.log(err)
         }
         res.send({
           user: user,
           calificaciones: calificaciones,
           preguntas: preguntas
         })
       })
     })
   })
 } else {
   res.send({
     user: false
   })
 }
})
app.get('/api/loggedinTienda', function(req, res){
 if (req.isAuthenticated()) {
   Usuario.findOne({idUsuario: req.user.idUsuario}, (err, user) => {
     if (err) {
       console.log(err)
     }
     Tienda.find({idUsuario: req.user.idUsuario}, (err, ventas) => {
       if (err) {
         console.log(err)
       }
       Calificacion.find({$or:[ {idVendedor:req.user.idUsuario}, {idComprador:req.user.idUsuario}]}, (err, calificaciones) => {
         if (err) {
           console.log(err)
         }
         res.send({
           user: user,
           ventas: ventas,
           calificaciones: calificaciones
         })
       })
     })
   })
 } else {
   res.send({
     user: false
   })
 }
})
app.get('/api/loggedinCalificaciones', function(req, res){
 if (req.isAuthenticated()) {
   Usuario.findOne({idUsuario: req.user.idUsuario}, (err, user) => {
     if (err) {
       console.log(err)
     }
     Calificacion.find({$or:[ {idVendedor:req.user.idUsuario}, {idComprador:req.user.idUsuario}]}, (err, calificaciones) => {
       if (err) {
         console.log(err)
       }
       res.send({
         user: user,
         calificaciones: calificaciones
       })
     })
   })
 } else {
   res.send({
     user: false
   })
 }
})

app.get('/api/loggedinTransferencias', function(req, res){
  if (req.isAuthenticated()) {
    Usuario.findOne({idUsuario: req.user.idUsuario}, (err, user) => {
      if (err) {
        console.log(err)
      }
      Transferencias.find({idUsuario: req.user.idUsuario}, (err, transfer) => {
        if (err) {
          console.log(err)
        }
        Pagos.find({idUsuario: req.user.idUsuario}, (err, pagos) => {
          if (err) {
            console.log(err)
          }
          Calificacion.find({$or:[ {idVendedor:req.user.idUsuario}, {idComprador:req.user.idUsuario}]}, (err, calificaciones) => {
            if (err) {
              console.log(err)
            }
            res.send({
              user: user,
              calificaciones: calificaciones,
              transferencias: transfer,
              pagos: pagos
            })
          })
        })
      })
    })
  } else {
    res.send({
      user: false
    })
  }
})

app.post('/api/logout', function(req, res){
 req.logOut()
 return res.status(200).send({
    message: 'Puede continuar'
 })
})

function deprecarToken() {
  const hora = Date.now()
  Tokens.find({}, (err, token) => {
    for (var i = 0; i < token.length; i++) {
      var resta = (hora - token[i].hora)
      if (resta > 360000) {
        token[i].remove((err, data) => {
          if (err) {
            console.log(err)
          }
        })
      }
    }
  })
}
setInterval(deprecarToken,60000)
module.exports = app
