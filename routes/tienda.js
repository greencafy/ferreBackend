// Requires
var express = require('express');
var app = express();


var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

// Imports 
var Tienda = require('../models/tienda');

// ==========================================
// ==========================================
// Guardar Nueva tienda
// ==========================================
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (require, res) => {
    var body = require.body;
    var tienda = new Tienda({
        nombre: body.nombre,
        usuario: require.usuario._id

    });

    tienda.save((err, TiendaGuardada) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Error en base de datos - Tienda',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            tienda: TiendaGuardada,

        });

    });


});

// ==========================================
// ==========================================
// Obtener tiendas cradas
// ==========================================
// ==========================================

app.get('/', (require, res) => {

    Tienda.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, tienda) => {
                if (err) {

                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en base de datos',
                        errors: err
                    });
                } else {

                    res.status(200).json({
                        ok: true,
                        Tiendas: tienda
                    });

                }

            });
});


// ==========================================
// ==========================================
// Modificar tienda
// ==========================================
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Tienda.findById(id, (err, tienda) => {

        if (err) {
            return tienda.status(500).json({
                ok: false,
                mensaje: 'error al buscar Tienda',
                errors: err
            });
        }
        if (!tienda) {
            return tienda.status(400).json({
                ok: false,
                mensaje: 'Error la tienda ' + id + ' No existe ',
                errors: { message: 'Tienda no existe con ese ID' }
            });

        }

        tienda.nombre = body.nombre;
        tienda.usuario = req.usuario._id;

        tienda.save((err, TiendaGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Tienda ...',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                mensaje: 'Se actualizo correctamente',
                TiendaGuardada: TiendaGuardada,

            });



        });
    });
});


// ==========================================
// ==========================================
// Borrar tienda
// ==========================================
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Tienda.findByIdAndRemove(id, (err, tiendaBorrada) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar tienda',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            tiendaBorrada: tiendaBorrada
        });
    });

});



module.exports = app;