const express = require('express');
const session = require('express-session');
const path = require('path');
const audioRoutes = require('./routes/audioRoutes');
const authRoutes = require('./routes/authRoutes');
const recordingsRoutes = require('./routes/recordingRoutes');
const accRoutes = require('./routes/accRoutes');
require('dotenv').config();
const sequelize = require('./config/db');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Nastavení šablonovacího enginu EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statické soubory (CSS, JS, obrázky)
app.use('/css', express.static(path.join(__dirname, 'public/css')));
sequelize.sync()
    .then(() => console.log('✅ Databáze je připojena a synchronizována'))
    .catch(err => console.error('❌ Chyba připojení k databázi:', err));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    cookie: { maxAge: 1000 * 60 * 60 }
}));

sequelize.sync()
    .then(() => console.log('✅ Databáze je připojena a synchronizována'))
    .catch(err => console.error('❌ Chyba připojení k databázi:', err));
// Hlavní stránkas
app.use('/keyboard/', audioRoutes);
app.use("/keyboard/auth", authRoutes)
app.use('/keyboard/recordings', recordingsRoutes);
app.use("/keyboard/account", accRoutes)


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server běží na portu ${PORT}/keyboard`);
});


// Spuštění serveru
