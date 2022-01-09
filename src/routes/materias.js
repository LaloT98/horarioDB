const express = require('express');
const router = express.Router();
const materia = require('../models/Escuela');
const { isAuthenticated } = require('../helpers/auth');

router.get('/schedule/materia-add', isAuthenticated, (req, res) => {
    res.render('materia/new-materia');
})

router.post('/schedule/materia', isAuthenticated, async (req, res) => {
    const { title, Mname, Mtotal, MidealHours, MmaxTimeDay, MHoursWeek } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: "Por favor, inserte un titulo" });
    }
    if (errors.length > 0) {
        res.render('materia/new-materia', {
            errors,
            title,
            Mname,
            Mtotal,
            MidealHours,
            MmaxTimeDay,
            MHoursWeek
        });
    }
    else {
        const newMateria = new materia({ title, Mname, Mtotal, MidealHours, MmaxTimeDay, MHoursWeek });
        newMateria.user = req.user.id;
        await newMateria.save();
        req.flash('success_msg', 'Datos de las materias guardadas exitosamente');
        res.redirect("/materia");
    }
});




router.get('/materia', isAuthenticated, async (req, res) => {
    const Materia = await materia.find({ user: req.user.id, title: "MATERIA" }).sort({ date: 'desc' }).lean();
    const totalMateria = await materia.find({user: req.user.id, title: "MATERIA"}).count()
    console.log(totalMateria)
    res.render("materia/all-materia", { Materia, totalMateria });
});



////viene de view/all-
router.get('/schedule/Medit/:id', isAuthenticated, async (req, res) => {
    const MATERIA = await materia.findById(req.params.id).lean();
    res.render("materia/edit-materia", { MATERIA });
})
////viene de view/edit-
router.put("/schedule/edit-materia/:id", async (req, res) => {
    const { Mname, Mtotal, MidealHours, MmaxTimeDay, MHoursWeek } = req.body;
    await materia.findByIdAndUpdate(req.params.id, { Mname, Mtotal, MidealHours, MmaxTimeDay, MHoursWeek });
    res.redirect('/materia');
})

router.delete("/schedule/Mdelete/:id", async (req, res) => {
    await materia.findByIdAndDelete(req.params.id);
    res.redirect('/materia');
})

module.exports = router;