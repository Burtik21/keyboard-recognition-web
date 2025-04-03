const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const  wavProcesess = require("../services/wavProcesses")

const  pythonHandover = require("../services/pythonHandover")
const logger = require("../utils/logger")


// controllers/audioController.js
exports.getAudioPage = (req, res) => {
    res.render('audioPage');
};

exports.uploadAudio = async (req, res) => {
    let wav_path;
    let response;
    try {
        const inputPath = req.file.path;
        wav_path = await wavProcesess.saveWav(inputPath)
        logger.info(wav_path)
        await pythonHandover.sendToPython(wav_path)
        res.status(200).jsonp({log:"zpracovano"})


    } catch (err) {
        console.error("Chyba při zpracování uploadu:", err);
        res.status(500).json({error: "Zpracování audio chunku selhalo"});
    }
};
