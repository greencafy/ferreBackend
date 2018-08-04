var express = require('express');
var app = express();

var Tienda = require('../models/tienda');
var Productos = require('../models/producto');
var Usuario = require('../models/usuario');

// ==========================================
// ==========================================
// buscar por coleccion
// ==========================================
// ==========================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
            break;

        case 'tiendas':
            promesa = buscarTiendas(busqueda, regex);
            break;

        case 'productos':
            promesa = buscarProductos(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y tienda',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==========================================
// ==========================================
// busqueda general
// ==========================================
// ==========================================
app.get('/todo/:busqueda', (require, response, next) => {

    var busqueda = require.params.busqueda;
    var regex = RegExp(busqueda, 'i');

    Promise.all([buscarTiendas(busqueda, regex),
            buscarProductos(busqueda, regex),
            buscarUsuario(busqueda, regex)
        ])
        .then(respuestas => {
            response.status(200).json({
                ok: true,
                mensaje: 'peticion realizada correctamente busqueda',
                tiendas: respuestas[0],
                productos: respuestas[1],
                usuarios: respuestas[2]
            });



        });

    function buscarTiendas(busqueda, regex) {
        return new Promise((resolve, reject) => {
            Tienda.find({ nombre: regex })
                .populate('usuario', 'nombre email')
                .exec((err, tiendas) => {
                    if (err) {
                        reject('Error en la promesa de busqueda', err);
                    } else {
                        resolve(tiendas);
                    }
                });
        });
    }

    function buscarProductos(busqueda, regex) {
        return new Promise((resolve, reject) => {
            Productos.find({ nombre: regex })
                .populate('usuario', 'nombre email')
                .populate('tiendas', 'nombre ')
                .exec((err, productos) => {
                    if (err) {
                        reject('Error en la promesa de busqueda', err);
                    } else {
                        resolve(productos);
                    }
                });
        });
    }

    function buscarUsuario(busqueda, regex) {
        return new Promise((resolve, reject) => {
            Usuario.find({}, 'nombre email role')
                .or([{ 'nombre': regex }, { 'email': regex }])
                .exec((err, usuarios) => {
                    if (err) {
                        reject('error en usuarios - busqueda');
                    } else {
                        resolve(usuarios);
                    }
                })
        });
    }
});

module.exports = app;