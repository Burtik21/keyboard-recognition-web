const express = require('express');
const session = require('express-session');
const path = require('path');
const audioRoutes = require('./routes/audioRoutes');
const authRoutes = require('./routes/authRoutes');
const recordingsRoutes = require('./routes/recordingRoutes');
const timeoutMiddleware = require('./middleware/timeoutMiddleware');
const accRoutes = require('./routes/accRoutes');
require('dotenv').config();
const sequelize = require('./config/db');

console.log(path.join(__dirname, 'public'))

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Nastavení šablonovacího enginu EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statické soubory (CSS, JS, obrázky)
app.use(express.static(path.join(__dirname, 'public')));


sequelize.sync()
    .then(() => console.log('✅ Databáze je připojena a synchronizována'))
    .catch(err => console.error('❌ Chyba připojení k databázi:', err));

app.use(session({
    secret: 'secret',  // Změňte na bezpečnější secret v produkci
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,  // Pokud používáš HTTP (pro HTTPS nastav na true)
        maxAge: 1000 * 60 * 60  // Cookie vyprší po 1 hodině
    }
}));

// Hlavní stránkas
app.use(timeoutMiddleware);
app.use('/record', audioRoutes);
app.use("/auth", authRoutes)
app.use('/recordings', recordingsRoutes);
app.use("/account", accRoutes)




const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server běží na portu ${PORT}/keyboard`);
});


// Spuštění serveru
