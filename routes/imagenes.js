var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');


app.get('/:tipo/:img', (require, response, next) => {

    var tipo = require.params.tipo;
    var img = require.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        response.sendFile(pathImagen);
    } else {
        var pathNOImage = path.resolve(__dirname, '../assets/no-img.jpg');
        response.sendFile(pathNOImage);
    }



});

module.exports = app;