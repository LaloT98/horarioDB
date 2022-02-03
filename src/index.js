const express = require('express');
const path = require('path');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require("connect-flash");
const passport = require('passport');

//Inicializaciones
const app = express();
require('./database');
//require("./ejecutar")
require('./config/passport');


//Configuraciones
// app.use(morgan("dev"))
app.set('port', process.env.PORT || 4005);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
}));
app.set("view engine", ".hbs");

//Funciones ejecutadas antes que llegen al servidor
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Variables globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.errorFatal = req.flash("errorFatal");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

//rutas de mi servidor
app.use(require('./routes/index'));
app.use(require('./routes/user'));
app.use(require('./routes/alumnos'));
app.use(require('./routes/maestros'));
app.use(require('./routes/materias'));
app.use(require('./routes/salones'));
app.use(require('./routes/mainMenu'));





//archivos estaticoss
app.use(express.static(path.join(__dirname, 'public')));

//inicar servidor o servidor escuchando
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});