const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/horarios-app")
.then(db => console.log('DB is connected'))
.catch(err => console.error(err));
