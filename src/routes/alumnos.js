const express = require('express');
const router = express.Router();
const student = require('../models/Escuela');
const { isAuthenticated } = require('../helpers/auth');

router.get('/schedule/student-add', isAuthenticated, (req, res) => {
    res.render('alumno/new-student');
});

router.post('/schedule/student', isAuthenticated, async (req, res) => {
    const { title, Stotal } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: "Por favor, inserte un titulo" });
    }
    if (errors.length > 0) {
        res.render('alumno/new-student', {
            errors,
            title,
            Stotal,
        });
    }
    else {
        const newStudent = new student({ title, Stotal });
        newStudent.user = req.user.id;
        await newStudent.save();
        req.flash('success_msg', 'Datos de estudiantes guardados exitosamente');
        res.redirect("/student");
    }
});

router.get('/student', isAuthenticated, async (req, res) => {
    const totalStudent = await student.find({user: req.user.id, title: "ESTUDIANTE"}).count()
    const Student = await student.find({ user: req.user.id, title: "ESTUDIANTE"}).sort({ date: 'desc' }).lean();
    console.log(totalStudent)
    res.render("alumno/all-student", { Student, totalStudent });
});

router.get('/schedule/edit/:id', isAuthenticated, async (req, res) => {
    const STUDENT = await student.findById(req.params.id).lean();
    res.render("alumno/edit-student", { STUDENT });
})

router.put("/schedule/edit-student/:id", async (req, res) => {
    const { Stotal } = req.body;
    await student.findByIdAndUpdate(req.params.id, { Stotal });
    res.redirect('/student');
})

router.delete("/schedule/Sdelete/:id", async (req, res) => {
    await student.findByIdAndDelete(req.params.id);
    res.redirect('/student');
})

module.exports = router;