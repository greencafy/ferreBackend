    // Requires
    var express = require('express');
    var bcrypt = require('bcryptjs');
    var app = express();

    var jwt = require('jsonwebtoken');

    var mdAutenticacion = require('../middlewares/autenticacion');

    // Imports 
    var Usuario = require('../models/usuario');




    // ==========================================
    // ==========================================
    // Obtener todos los usuarios
    // ==========================================
    // ==========================================

    app.get('/', (require, response, next) => {

        var desde = require.query.desde || 0;
        desde = Number(desde);

        Usuario.find({}, 'nombre email img role')
            .skip(desde)
            .limit(5)
            .exec(
                (err, usuarios) => {
                    if (err) {

                        return response.status(500).json({
                            ok: false,
                            mensaje: 'Error en base de datos',
                            errors: err
                        });
                    }
                    Usuario.count({}, (err, conteo) => {
                        if (err) {

                            return response.status(500).json({
                                ok: false,
                                mensaje: 'Error en base de datos no se pueden encontrar usuarios',
                                errors: err
                            });
                        }

                        response.status(200).json({
                            ok: true,
                            usuarios: usuarios,
                            totalUsuarios: conteo
                        });

                    });



                });


    });



    // ==========================================
    // ==========================================
    // Actualizar usuario
    // ==========================================
    // ==========================================


    app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
        var id = req.params.id;
        var body = req.body;

        Usuario.findById(id, (err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al buscar usuario',
                    errors: err
                });
            }
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error el usuario ' + id + ' No existe ',
                    errors: { message: 'El usuario no existe con ese ID' }
                });

            }

            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;

            usuario.save((err, usuarioGuardado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario ...',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    mensaje: 'Se actualizo correctamente',
                    usuarioGuardado: usuarioGuardado,
                    actualizadoPor: req.usuario
                });



            });
        });
    });


    // ==========================================
    // ==========================================
    // Crear nuevo usuario
    // ==========================================
    // ==========================================

    app.post('/', mdAutenticacion.verificaToken, (require, res) => {
        var body = require.body;
        var usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            img: body.img,
            role: body.role
        });

        usuario.save((err, usuarioGuardado) => {
            if (err) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error en base de datos',
                    errors: err
                });
            }
            res.status(201).json({
                ok: true,
                body: usuarioGuardado,
                usuariotoken: require.usuario
            });

        });



    });
    // ==========================================
    // ==========================================
    // Borrar usuario por ID
    // ==========================================
    // ==========================================

    app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
        var id = req.params.id;

        Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
            if (err) {

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al borrar usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });
        });

    });

    module.exports = app;