const axios = require("axios");

async function sendToPython(filePath) {
    try {
        // Posíláme jen cestu k souboru
        const response = await axios.post('http://localhost:5499/process_audio', {
            filePath: filePath  // Posíláme pouze cestu
        });

        console.log('Python Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Chyba při odesílání na Python server:', error);
    }
}


module.exports = { sendToPython };
// Příklad volání funkce
