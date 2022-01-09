const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');



router.post('/users/signin', passport.authenticate('Ingreso', {
    successRedirect: '/main-menu',
    failureRedirect: '/',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const errors = [];
    const {nombre, apellidos,  nacimiento, matricula, correo, password, escuela, clave, nivel, confirm_password} = req.body;

    if (password != confirm_password) {
        errors.push({ text: "La contraseña no es igual" });
    }
    if (password.length < 4) {
        errors.push({ text: "colocar una contraseña mayor a 4 digitos" });
    }
    if (errors.length > 0) {
        res.render("users/signup", { errors, nombre, apellidos,  nacimiento, matricula, correo, escuela, clave, nivel });
    }
    else {
        const emailUser = await User.findOne({ correo: correo });
        if (emailUser) {
            req.flash('error_msg', 'El Correo ya esta registrado');
            res.redirect('/users/signup');
        }

        const newUser = new User({nombre, apellidos,  nacimiento, matricula, correo, password, escuela, clave, nivel });
        await newUser.save();
        req.flash('sucess_msg', 'Estas registrado');
        res.redirect('/');
    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

module.exports = router;