var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

var fs = require('fs');

var Usuario = require('../models/usuario');
var tienda = require('../models/tienda');
var Producto = require('../models/producto');

app.use(fileUpload());


app.put('/:tipo/:id', (require, response, next) => {

    var tipo = require.params.tipo;
    var id = require.params.id;

    // tipos de coleccion

    var tiposValidos = ['tiendas', 'productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valido'

        });
    }

    if (!require.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'No hay archivo que subir'

        });
    }

    // obtener nombre del archivo

    var archivo = require.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    var extensionesValidas = ['jpg', 'gif', 'jpeg', 'png'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            extensionArchivo: extensionArchivo

        });
    }


    // ==========================================
    // ==========================================
    // nombre de archivo personalizado
    // ==========================================
    // ==========================================

    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // ==========================================
    // ==========================================
    // MOver el archivo
    // ==========================================
    // ==========================================


    var path = `./uploads/${ tipo }/${ nombreArchivo }`;


    archivo.mv(path, err => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: ' no se pudo mover el archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, response);
        //response.status(200).json({
        //  ok: true,
        // mensaje: 'Archivo movido',
        //    nombreCortado: nombreCortado,
        //   extensionArchivo: extensionArchivo
        // });


    });

    function subirPorTipo(tipo, id, nombreArchivo, response) {
        if (tipo === 'usuarios') {
            Usuario.findById(id, (err, usuario) => {
                var pathViejo = './uploads/usuarios' + usuario.img;
                // verificar si hay imagen si si eliminarlo
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                usuario.img = nombreArchivo;

                usuario.save((err, usuarioActualizado) => {
                    usuarioActualizado.password = '...';
                    if (err) {
                        return response.status(400).json({
                            mensaje: 'error en actualizar imagen',
                            error: err
                        });
                    }

                    return response.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizado',
                        usuario: usuarioActualizado


                    });

                });


            });

        }
        if (tipo === 'tiendas') {
            tienda.findById(id, (err, tienda) => {
                var pathViejo = './uploads/tiendas' + tienda.img;
                // verificar si hay imagen si si eliminarlo
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                tienda.img = nombreArchivo;

                tienda.save((err, tiendaActualizada) => {
                    if (err) {
                        return response.status(400).json({
                            mensaje: 'error en actualizar imagen',
                            error: err
                        });
                    }

                    return response.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de tienda actualizada',
                        tienda: tiendaActualizada


                    });

                });


            });


        }
        if (tipo === 'productos') {
            Producto.findById(id, (err, producto) => {
                var pathViejo = './uploads/tiendas' + producto.img;
                // verificar si hay imagen si si eliminarlo
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }

                producto.img = nombreArchivo;

                producto.save((err, productoActualizado) => {
                    if (err) {
                        return response.status(400).json({
                            mensaje: 'error en actualizar imagen',
                            error: err
                        });
                    }

                    return response.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de tienda actualizada',
                        producto: productoActualizado


                    });

                });


            });

        }

    }

});

module.exports = app;