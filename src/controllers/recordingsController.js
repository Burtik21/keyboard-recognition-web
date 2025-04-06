const Recording = require('../models/Recording');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
// Funkce pro ukládání nahrávky
// Backend: Vytvoření záznamu nahrávky
exports.createRecording = async (req, res) => {
    const { userId } = req.session; // Předpokládám, že uživatelské ID je v session

    try {
        // Uložení záznamu s tím, že clickCount je zatím neznámý (nastaveno na 0 nebo null)
        const newRecording = await Recording.create({
            member_id: userId,
            recording_file_path: '',  // Předpokládejme, že nahrávka bude později přidána
            click_count: null,  // Počet kliků ještě neznáme
        });

        res.json({ message: 'Recording created successfully', recordingId: newRecording.recording_id });
    } catch (error) {
        logger.error('Chyba při vytváření nahrávky:', error);
        res.status(500).json({ error: 'Chyba při vytváření nahrávky' });
    }
};


// Další metoda pro získání všech nahrávek uživatele
exports.getUserRecordings = async (req, res) => {
    const { userId } = req.session;  // Získání ID uživatele z session

    try {
        if (!userId) {
            return res.status(403).send('Uživatel není přihlášen.');
        }

        const recordings = await Recording.findAll({
            where: { member_id: userId },
            order: [['created_at', 'DESC']]  // Seřazení podle data vytvoření, od nejnovější
        });

        // Renderování šablony a předání dat
        res.render('recordingsPage', { recordings });  // Předáme data do EJS šablony

    } catch (error) {
        logger.error('❌ Chyba při získávání nahrávek:', error);
        res.status(500).json({
            error: 'Došlo k chybě při získávání nahrávek.'
        });
    }
};

exports.updateClickCount = async (recordingId, clickCount) => {
    try {
        // Najdi nahrávku podle recordingId
        //console.log(recordingId)
        const recording = await Recording.findOne({ where: { recording_id: recordingId } });
        //console.log(recording)
        // Pokud nahrávka neexistuje, vrátíme chybu
        if (!recording) {
            throw new Error('Nahrávka nenalezena.');
        }

        // Aktualizuj click_count

        recording.click_count += clickCount;

        // Ulož záznam zpět do databáze
        await recording.save();

        return recording; // Vrátí aktualizovanou nahrávku
    } catch (error) {
        logger.error('Chyba při aktualizaci počtu kliků:', error);
        throw error; // Propagujeme chybu dál
    }
};
exports.updateDuration = async (recordingId, duration) => {
    try {
        // Najdi nahrávku podle recordingId
        //console.log(recordingId)
        const recording = await Recording.findOne({ where: { recording_id: recordingId } });
        //console.log(recording)
        // Pokud nahrávka neexistuje, vrátíme chybu
        if (!recording) {
            throw new Error('Nahrávka nenalezena.');
        }

        // Aktualizuj click_count

        recording.duration += duration;

        // Ulož záznam zpět do databáze
        await recording.save();

        return recording; // Vrátí aktualizovanou nahrávku
    } catch (error) {
        logger.error('Chyba při aktualizaci počtu kliků:', error);
        throw error; // Propagujeme chybu dál
    }
};

