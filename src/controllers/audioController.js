const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const uploadFolder = path.join(__dirname, '..', 'uploads');
const convertedFolder = path.join(__dirname, '..', 'converted');



fs.mkdirSync(uploadFolder, { recursive: true });
fs.mkdirSync(convertedFolder, { recursive: true });

// controllers/audioController.js
exports.getAudioPage = (req, res) => {
    res.render('audioPage');
};


exports.uploadAudio = (req, res) => {
    const inputPath = req.file.path;
    const baseName = path.parse(req.file.filename).name;
    const outputPath = path.join(convertedFolder, baseName + '.wav');

    // Konverze pomocí ffmpeg
    exec(`ffmpeg -y -i "${inputPath}" -ar 44100 -ac 1 "${outputPath}"`, (err) => {
        if (err) {
            console.error("FFmpeg chyba:", err);
            return res.status(500).json({ error: "Chyba při konverzi" });
        }

        // Zatím dummy data místo analýzy
        res.json({
            mfcc: Array(13).fill(0).map(() => Math.random()), // náhodná data
            rms: Math.random(),
            zcr: Math.random()
        });
    });
};
