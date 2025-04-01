const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5500;

// Statické soubory budou dostupné na /keyboard/
app.use('/keyboard', express.static('public'));

// Ujisti se, že složka uploads existuje
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

let counter = 1;
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => {
        const filename = `nahravka_${counter}.webm`;
        counter++;
        cb(null, filename);
    }
});
const upload = multer({ storage });

// Upload endpoint pod /keyboard/upload
app.post('/keyboard/upload', upload.single('audio'), (req, res) => {
    res.send({ message: 'Nahrávka uložena.' });
});

app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}/keyboard`);
});
