const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');

// Převod exec na Promise-based funkci
const execPromise = util.promisify(exec);
//absolutni cesta kde budou nahravky ukladany pro dalsi extrakci v pythonu
const uploadFolder = '/home/ubuntu/uploads'
// Cesty pro složky
//const uploadFolder = path.join(__dirname, '..', 'uploads');
const convertedFolder = path.join(__dirname, '..', 'converted');
const savedWavsFolder = path.join(__dirname, '..', 'saved_wavs');

// Vytvoření složek, pokud neexistují
//fs.mkdirSync(uploadFolder, { recursive: true });
fs.mkdirSync(convertedFolder, { recursive: true });
fs.mkdirSync(savedWavsFolder, { recursive: true });

/**
 * Funkce pro zpracování souboru, konverzi a uložení výsledků.
 * @param {string} inputPath - Cesta k původnímu souboru
 * @returns {Promise<string>} - Vrátí cestu k uloženému souboru
 */
async function saveWav(inputPath) {
    try {
        // Získání názvu souboru bez přípony
        const baseName = path.parse(inputPath).name;

        // Cesta pro uložený .wav soubor
        const outputPath = path.join(convertedFolder, baseName + '.wav');

        // Konverze .webm souboru na .wav pomocí ffmpeg
        await execPromise(`ffmpeg -y -i "${inputPath}" -ar 44100 -ac 1 "${outputPath}"`);

        // Uložení konvertovaného souboru do složky saved_wavs
        const savedWavPath = path.join(savedWavsFolder, baseName + '_saved.wav');
        await fs.promises.copyFile(outputPath, savedWavPath); // Kopírování souboru do složky saved_wavs
        //const globalUploads = path.join(uploadFolder, baseName + '.wav.');
        //await fs.promises.copyFile(outputPath, globalUploads);

        // Cleanup dočasných souborů
        fs.unlinkSync(inputPath);  // Odstraníme původní soubor
        fs.unlinkSync(outputPath); // Odstraníme dočasný .wav soubor

        // Vrátíme cestu k uloženému souboru
        return savedWavPath;

    } catch (err) {
        console.error("Chyba při zpracování:", err);
        throw new Error("Chyba při zpracování.");
    }
}
module.exports = { saveWav };
