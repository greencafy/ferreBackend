var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tiendaSchema = new Schema({

    nombre: { type: String, require: [true, 'El nombre del establecimiento es necesario'] },
    img: { type: String, require: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

}, { collection: 'tiendas' });

module.exports = mongoose.model('Tienda', tiendaSchema);