const axios = require("axios")
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');

/**
 * Funkce pro odeslání souboru na Python server.
 * @param {string} filePath - Cesta k souboru, který chceme poslat.
 */
async function sendToPython(filePath) {
    try {
        // Otevření souboru pro čtení jako stream
        const formData = new FormData();
        formData.append('audio_file', fs.createReadStream(filePath)); // Přidáme soubor do formData

        // Odeslání POST požadavku na Python API (endpoint /process_audio)
        const response = await axios.post('http://localhost:5000/process_audio', formData, {
            headers: formData.getHeaders() // Tohle je potřeba pro správné odeslání souboru
        });

        // Získání výsledků z Pythonu
        console.log('Python Response:', response.data);

        return response.data;
    } catch (error) {
        console.error('Chyba při odesílání na Python server:', error);
    }
}

// Příklad volání funkce
