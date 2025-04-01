const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5500;

// Nastavení složky pro uložení
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        cb(null, `audio_${timestamp}.wav`);
    }
});

const upload = multer({ storage });

// Vytvoření složky "uploads", pokud neexistuje
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// POST endpoint
app.post('/upload-audio', upload.single('audio'), (req, res) => {
    console.log(`📥 Přijatý soubor: ${req.file.originalname}`);
    res.status(200).send('✅ Audio úspěšně přijato!');
});

// Start serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`);
});
