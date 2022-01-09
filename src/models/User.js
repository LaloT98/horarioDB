const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        nombre: { type: String, trim: true },
        apellidos: { type: String, trim: true },
        nacimiento: { type: Date, trim: true },
        matricula: { type: String, trim: true },
        correo: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },

        escuela: { type: String, trim: true },
        clave: { type: String, trim: true },
        nivel: { type: String, trim: true },        

        date: { type: Date, default: Date.now },
    }
);

module.exports = mongoose.model('User', UserSchema)