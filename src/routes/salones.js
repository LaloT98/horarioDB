const express = require('express');
const router = express.Router();
const classroom = require('../models/Escuela');
const { isAuthenticated } = require('../helpers/auth');


router.post('/schedule/classroom', isAuthenticated, async (req, res) => {
    const { title, Ctotal, Ctype, Ccapacity } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: "Por favor, inserte un titulo" });
    }
    if (errors.length > 0) {
        res.render('salon/new-classroom', {
            errors,
            title,
            Ctotal,
            Ctype,
            Ccapacity
        });
    }
    else {
        const newClasssroom = new classroom({ title, Ctotal, Ctype, Ccapacity });
        newClasssroom.user = req.user.id;
        await newClasssroom.save();
        req.flash('success_msg', 'Datos de los salones guardados exitosamente');
        res.redirect("/classroom");
    }
});



router.get('/schedule/classroom-add', isAuthenticated, (req, res) => {
    res.render('salon/new-classroom');
});

router.get('/classroom', isAuthenticated, async (req, res) => {
    const Classroom = await classroom.find({ user: req.user.id, title: "SALON" }).sort({ date: 'desc' }).lean();
    const totalClassroom = await classroom.find({user: req.user.id, title: "SALON"}).count()
    console.log(totalClassroom)
    res.render("salon/all-classroom", { Classroom , totalClassroom});
});

router.get('/schedule/Cedit/:id', isAuthenticated, async (req, res) => {
    const CLASSROOM = await classroom.findById(req.params.id).lean();
    res.render("salon/edit-classroom", { CLASSROOM });
})

router.put("/schedule/edit-classroom/:id", async (req, res) => {
    const { Ctotal, Ctype, Ccapacity } = req.body;
    await classroom.findByIdAndUpdate(req.params.id, { Ctotal, Ctype, Ccapacity });
    res.redirect('/classroom');
})

router.delete("/schedule/Cdelete/:id", async (req, res) => {
    await classroom.findByIdAndDelete(req.params.id);
    res.redirect('/classroom');
})

module.exports = router;