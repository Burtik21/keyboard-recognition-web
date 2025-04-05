const axios = require("axios");
const recordingsController = require('../controllers/recordingsController');

async function sendToPython(filePath, recordingId) {
    try {
        // Posíláme cestu k souboru na Python server
        const response = await axios.post('http://localhost:5499/process_audio', {
            filePath: filePath
        });

        console.log('Python Response:', response.data);

        // Získáme kliky z odpovědi
        const clicks = response.data.clicks;

        try {
            await recordingsController.updateClickCount(recordingId, clicks)


        } catch (error) {
            console.error('Chyba při volání serveru pro aktualizaci kliků:', error);
        }

        return response.data;  // Vracíme odpověď z Python serveru

    } catch (error) {
        console.error('Chyba při odesílání na Python server:', error);
    }
}


module.exports = { sendToPython };
// Příklad volání funkce
