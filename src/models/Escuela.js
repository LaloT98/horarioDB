const mongoose = require('mongoose');
const { type } = require('os');
const { Schema } = mongoose;

const SchoolSchema = new Schema({

    title: { type: String },
    // Alumnos
    Stitle: { type: String },
    Stotal: { type: String },
    // Maestros
    Ttitle: { type: String},
    Tname: { type: String},
    Ttotal: { type: String},
    TworkWeek: { type: String},
    //Materia
    Mtitle: { type: String },
    Mname: { type: String},
    Mtotal: { type: String },
    MidealHours: { type: String },
    MmaxTimeDay: { type: String},
    MHoursWeek: { type: String },
    //Salon
    Ctitle: { type: String },
    Ctotal: { type: String },
    Ctype: { type: String },
    Ccapacity: { type: String },


    date: { type: Date, default: Date.now },
    user: { type: String }
})
module.exports = mongoose.model('escuela', SchoolSchema);