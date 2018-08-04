    // Requires
    var express = require('express');
    var bcrypt = require('bcryptjs');
    var jwt = require('jsonwebtoken');

    var SEED = require('../config/config').SEED;

    var app = express();

    var Usuario = require('../models/usuario');

    app.post('/', (require, response) => {

        var body = require.body;

        Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

            if (err) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscaru usuarios',
                    errors: err
                });
            }
            if (!usuarioBD) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error en el - email',
                    errors: err
                });
            }

            if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error en el - password',
                    errors: err
                });
            }
            //Crear un toquen
            usuarioBD.password = '.......';
            var token = jwt.sign({ usuario: usuarioBD }, SEED);


            response.status(200).json({
                ok: true,
                usuario: usuarioBD,
                token: token,
                id: usuarioBD._id
            });
        });


    });



    module.exports = app;