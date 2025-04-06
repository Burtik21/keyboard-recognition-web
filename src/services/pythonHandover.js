const axios = require("axios");
const recordingsController = require('../controllers/recordingsController');
const logger = require('../utils/logger');

async function sendToPython(filePath, recordingId) {
    try {
        // Posíláme cestu k souboru na Python server
        logger.info( process.env.PYTHON_PORT)
        const response = await axios.post("http://localhost:" +  process.env.PYTHON_PORT+ "/process_audio", {
            filePath: filePath
        });

        logger.info('Python Response:', response.data);

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
