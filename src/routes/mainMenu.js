const express = require('express');
const { request } = require('http');
const router = express.Router();
const User = require('../models/User');
const Escuela = require('../models/Escuela');
const { format } = require('timeago.js');



const { isAuthenticated } = require('../helpers/auth');


router.get('/main-menu', isAuthenticated, async (req, res) => {
    const usuario = await User.findById(req.user.id).lean()
    const fecha = format(usuario.date)
    res.render("menu/menu", {usuario, fecha});
});


router.get('/teacher', isAuthenticated, (req, res) => {
    res.render('maestro/all-teacher');
});

router.get('/student', isAuthenticated, (req, res) => {
    res.render('alumno/all-student');
});

router.get('/classroom', isAuthenticated, (req, res) => {
    res.render('salon/all-classroom');
});

router.get('/materia', isAuthenticated, (req, res) => {
    res.render('materia/all-materia');
});

router.get('/all', isAuthenticated, async(req, res) => {
    const Student = await Escuela.find({ user: req.user.id, title: "ESTUDIANTE"}).sort({ date: 'desc' }).lean();
    const Teacher = await Escuela.find({ user: req.user.id, title: "MAESTRO" }).sort({ date: 'desc' }).lean();
    const Materia = await Escuela.find({ user: req.user.id, title: "MATERIA" }).sort({ date: 'desc' }).lean();
    const Classroom = await Escuela.find({ user: req.user.id, title: "SALON" }).sort({ date: 'desc' }).lean();
    const totalTeacher = await Escuela.find({user: req.user.id, title: "MAESTRO"}).count().lean()
    const totalStudent = await Escuela.find({user: req.user.id, title: "ESTUDIANTE"}).count()
    const totalClassroom = await Escuela.find({user: req.user.id, title: "SALON"}).count()
    const totalMateria = await Escuela.find({user: req.user.id, title: "MATERIA"}).count()

    res.render('menu/all', {Student, Teacher, Materia, Classroom, totalTeacher, totalStudent, totalClassroom, totalMateria });
});



module.exports = router;