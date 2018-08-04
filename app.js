// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


module.exports = app;


// Inicializar variables
var app = express();

// Body parser configure
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// server index config 

//var serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'))
//app.use('/uploads', serveIndex(__dirname + '/uploads'));

// IMportacion de rutas
var appRoutes = require('./routes/app');
var imagenesRoutes = require('./routes/imagenes');
var usuarioRoutes = require('./routes/usuario');
var productoRoutes = require('./routes/producto');
var uploadRoutes = require('./routes/upload');
var busqudaRoutes = require('./routes/busqueda');
var tiendaRoutes = require('./routes/tienda');
var loginRoutes = require('./routes/login');

// conexion a BD
mongoose.connection.openUri('mongodb://localhost:27017/FerreApp', (err, response) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', ' Online');
});

// rutas
app.use('/productos', productoRoutes);
app.use('/busqueda', busqudaRoutes);
app.use('/imagenes', imagenesRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/upload', uploadRoutes);
app.use('/tienda', tiendaRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Escuchar peticiones 
app.listen(3000, () => {
    console.log('El puero 3000 esta listo para funcionar: \x1b[32m%s\x1b[0m', ' Online');
});