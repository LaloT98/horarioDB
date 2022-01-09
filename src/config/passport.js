const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use("Ingreso", new LocalStrategy(
    {
        usernameField: "correo",
        passwordField: "password",
        passReqToCallback: true
    },

    async (req, correo, password, done) => {
        const user =  await User.findOne({ correo: correo });
        if (user) {
            const contrasena = await User.findOne({ correo: correo, password: password });
            if (contrasena) { return done(null, user); }
            else { return done(null, false, { message: "Contraseña Incorrecta" }); }
        }
        else {
            return done(null, false, { message: "El correo no existe" });
        }
    }
));



passport.serializeUser((user, done) => { 
    done(null, user.id); });

passport.deserializeUser((id, done) => { 
    User.findById(id, (err, user) => { done(err, user) }); });