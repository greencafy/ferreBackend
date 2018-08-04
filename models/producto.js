var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'la descripcion es necesaria'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    tiendas: {
        type: Schema.Types.ObjectId,
        ref: 'Tienda',
        required: [true, 'El id tienda es un campo obligatorio ']
    }
});


module.exports = mongoose.model('Producto', productoSchema);