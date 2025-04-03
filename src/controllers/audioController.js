const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const  wavProcesess = require("../services/wavProcesses")
//const  {sendToPython} = require("../services/pythonHandover")
const logger = require("../utils/logger")


// controllers/audioController.js
exports.getAudioPage = (req, res) => {
    res.render('audioPage');
};

exports.uploadAudio = async (req, res) => {
    let wav_path;
    try {
        const inputPath = req.file.path;
        wav_path = wavProcesess.saveWav(inputPath)
        logger.info(wav_path)
        //sendToPython(wav_path)
        // ✅ 7. Odpověď klientovi


    } catch (err) {
        console.error("Chyba při zpracování uploadu:", err);
        res.status(500).json({error: "Zpracování audio chunku selhalo"});
    }
};
