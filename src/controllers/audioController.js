const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const  wavProcesess = require("../services/wavProcesses")
const UserSession = require('../models/UserSession');
const  pythonHandover = require("../services/pythonHandover")
const  recordingsController = require("../controllers/recordingsController")
const logger = require("../utils/logger")

let deviceType = null
// controllers/audioController.js
exports.getAudioPage = async (req, res) => {
    const userId = req.session.userId;  // Uživatelské ID získáme z session

    // Pokud není uživatel přihlášen, vrátíme chybu nebo přesměrujeme na přihlášení
    if (!userId) {
        return res.status(401).send('Nejste přihlášeni');
        // nebo přesměrování:
        // return res.redirect('/auth/login');
    }

    try {
        // Získáme všechny aktivní session pro tohoto uživatele
        const activeSessions = await UserSession.findAll({
            where: { memberId: userId, active: true }  // Hledáme pouze aktivní session
        });
        console.log(activeSessions)
        // Zkontrolujeme, jestli existuje nějaká session s deviceType = 'mobile'
        const hasMobileSession = activeSessions.some(session => session.deviceType === 'mobile');

        // Uložíme informace o deviceType a mobile session do res.locals pro použití v controlleru
        res.locals.hasMobileSession = hasMobileSession;
        deviceType = res.locals.deviceType
        // Pokud máš deviceType v session, tak sem

        // Zde můžeš také zjistit, zda má uživatel přihlášený více než jedno zařízení
        const multipleDevices = activeSessions.length > 1;  // Pokud je více než jedna aktivní session

        // Renderování šablony s těmito daty
        res.render('audioPage', {
            deviceType: deviceType,
            multipleDevices: multipleDevices,  // Seznam všech zařízení, na kterých je uživatel přihlášen
            hasMobileSession: res.locals.hasMobileSession  // Informace, zda má uživatel aktivní session na mobilu
        });
    } catch (error) {
        console.error('❌ Chyba při kontrole zařízení:', error);
        return res.status(500).send('Chyba při zpracování požadavku.');
    }
};

exports.uploadAudio = async (req, res) => {
    let wav_path;
    let response;
    try {

        const inputPath = req.file.path;
        const recordingId = req.body.recordingId;
        recordingsController.updateDuration(recordingId,1)
        console.log("recording id JE:")
        console.log(recordingId)
        wav_path = await wavProcesess.saveWav(inputPath)
        logger.info(wav_path)
        await pythonHandover.sendToPython(wav_path, recordingId)
        res.status(200).jsonp({log:"zpracovano"})


    } catch (err) {
        console.error("Chyba při zpracování uploadu:", err);
        res.status(500).json({error: "Zpracování audio chunku selhalo"});
    }
};
