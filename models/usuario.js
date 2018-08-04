var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'EL rol no es permitido'
};


var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El campo nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El campo correo es necesario'] },
    password: { type: String, required: [true, 'El campo password es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
});
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);