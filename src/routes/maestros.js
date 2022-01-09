const express = require('express');
const router = express.Router();
const teacher = require('../models/Escuela');
const { isAuthenticated } = require('../helpers/auth');


router.get('/schedule/teacher-add', isAuthenticated, (req, res) => {
    res.render('maestro/new-teacher');
})

router.post('/schedule/teacher', isAuthenticated, async (req, res) => {
    const { title, Tname, Ttotal, TworkWeek } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: "Por favor, inserte un titulo" });
    }
    if (errors.length > 0) {
        res.render('maestro/new-teacher', {
            errors,
            title,
            Tname,
            Ttotal,
            TworkWeek
        });
    }
    else {
        const newTeacher = new teacher({ title, Tname, Ttotal, TworkWeek });
        newTeacher.user = req.user.id;
        await newTeacher.save();
        req.flash('success_msg', 'Datos de Maestros guardados exitosamente');
        res.redirect("/teacher");
    }
});



router.get('/teacher', isAuthenticated, async (req, res) => {
    const Teacher = await teacher.find({ user: req.user.id, title: "MAESTRO" }).sort({ date: 'desc' }).lean();
    const totalTeacher = await teacher.find({user: req.user.id, title: "MAESTRO"}).count().lean()
    console.log(totalTeacher)
    res.render("maestro/all-teacher", { Teacher, totalTeacher });
});

router.get('/schedule/Tedit/:id', isAuthenticated, async (req, res) => {
    const TEACHER = await teacher.findById(req.params.id).lean();
    res.render("maestro/edit-teacher", { TEACHER });
})

router.put("/schedule/edit-teacher/:id", async (req, res) => {
    const { Tname, Ttotal, TworkWeek } = req.body;
    await teacher.findByIdAndUpdate(req.params.id, { Tname, Ttotal, TworkWeek });
    res.redirect('/teacher');
})
router.delete("/schedule/Tdelete/:id", async (req, res) => {
    await teacher.findByIdAndDelete(req.params.id);
    res.redirect('/teacher');
})

module.exports = router;