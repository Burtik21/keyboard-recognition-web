const express = require('express');
const session = require('express-session');
const path = require('path');
const audioRoutes = require('./routes/audioRoutes');
const authRoutes = require('./routes/authRoutes');
const recordingsRoutes = require('./routes/recordingRoutes');
const accRoutes = require('./routes/accRoutes');
require('dotenv').config();
//const sequelize = require('./config/db');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Nastavení šablonovacího enginu EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statické soubory (CSS, JS, obrázky)
app.use('/css', express.static(path.join(__dirname, 'public/css')));


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    cookie: { maxAge: 1000 * 60 * 60 }
}));


// Hlavní stránkas
app.use('/keyboard/', audioRoutes);
app.use("/keyboard/auth", authRoutes)
app.use('/keyboard/recordings', recordingsRoutes);
app.use("/keyboard/account", accRoutes)
//app.use("/auth", authRoutes)

const PORT = process.env.PORT; //|| 3000
app.listen(PORT, () => {
    console.log(`🚀 Server běží na portu ${PORT}/keyboard`);
});


// Spuštění serveru
