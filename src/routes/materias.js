const express = require('express');
const router = express.Router();
const materia = require('../models/Escuela');
const { isAuthenticated } = require('../helpers/auth');

router.get('/schedule/materia-add', isAuthenticated, (req, res) => {
    res.render('materia/new-materia');
})

router.post('/schedule/materia', isAuthenticated, async(req, res) => {
    const { title, IDmateria, carrera, hrsMin, hrsMax } = req.body;

    const errors = [];
    if (!title) {
        errors.push({ text: "Por favor, inserte un titulo" });
    }
    if (errors.length > 0) {
        res.render('materia/new-materia', {
            errors,
            title,
            IDmateria,
            carrera,
            hrsMin,
            hrsMax
        });
    } else {
        const newMateria = new materia({ title, IDmateria, carrera, hrsMin, hrsMax });

        newMateria.puntos = "0";
        newMateria.peso = "1";
        arrayMateria = [IDmateria, hrsMin, hrsMax, "0", carrera, "1"]
        let array = arrayMateria.map(i => Number(i));
        newMateria.array
        newMateria.user = req.user.id;
        await newMateria.save();
        req.flash('success_msg', 'Datos de las materias guardadas exitosamente');
        res.redirect("/materia");
    }
});




router.get('/materia', isAuthenticated, async(req, res) => {
    const Materia = await materia.find({ user: req.user.id, title: "MATERIA" }).sort({ date: 'desc' }).lean();
    const totalMateria = await materia.find({ user: req.user.id, title: "MATERIA" }).count()
    console.log(totalMateria)
    res.render("materia/all-materia", { Materia, totalMateria });
});



////Muestra los datos de la materia especifica en el REnder
router.get('/schedule/Medit/:id', isAuthenticated, async(req, res) => {
        const MATERIA = await materia.findById(req.params.id).lean();
        res.render("materia/edit-materia", { MATERIA });
        console.log(MATERIA)
    })
    //IDmateria, carrera, hrsMin, hrsMax, puntos, peso, arrayMateria
    ///Muestra
router.put("/schedule/edit-materia/:id", async(req, res) => {
    const { IDmateria, carrera, hrsMin, hrsMax } = req.body;
    arrayMateria = [IDmateria, hrsMin, hrsMax, "0", carrera, "1"]
    let array = arrayMateria.map(i => Number(i));
    await materia.findByIdAndUpdate(req.params.id, { IDmateria, carrera, hrsMin, hrsMax, array });
    res.redirect('/materia');
})

router.delete("/schedule/Mdelete/:id", async(req, res) => {
    await materia.findByIdAndDelete(req.params.id);
    res.redirect('/materia');
})

router.get('/schedule/add', async(req, res) => {
    require("../ejecutar")
    res.render("materia/horario");
})

module.exports = router;