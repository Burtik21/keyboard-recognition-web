const wavEncoder = require("wav-encoder");
const { processSegment } = require('./processing');

async function calculateRMSFromWav(wavBuffer) {
    console.log("spusteno kalkulovani")
    let wavWithoutHeader = deleteHeader(wavBuffer); // Oříznutí hlavičky
    const frameSize = 1024;  // 1024 vzorků = 23ms při 44.1kHz (1 frame)

    let max = 0;
    let lastRMS = 0; // Poslední RMS hodnota pro porovnání
    let recording = false; // Flag pro sledování, zda probíhá detekce

    const threshold = parseFloat(process.env.THRESHOLD);

    let currentSegment = [];

    for (let i = 0; i < wavWithoutHeader.length; i += frameSize * 2) {
        let sum = 0;

        for (let j = 0; j < frameSize * 2; j += 2) {
            const index = i + j;
            if (index + 1 >= wavWithoutHeader.length) break;

            const sample = wavWithoutHeader.readInt16LE(index); // 2 bajty = 1 vzorek
            const normalized = sample / 32768;  // Normalizace na -1.0 až 1.0
            sum += normalized * normalized;
        }

        const rms = Math.sqrt(sum / frameSize); // RMS pro aktuální frame
        console.log(`RMS ve framu ${i / (frameSize * 2)}: ${rms}`);

        if (rms > threshold && !recording) {
            recording = true;
            currentSegment = []; // Resetujeme aktuální segment
        }

        if (recording) {
            currentSegment.push(wavWithoutHeader.slice(i, i + frameSize * 2));  // Přidáme tento frame do segmentu
        }

        if (recording && rms < threshold && lastRMS > threshold) {
            recording = false;
            await processSegment(currentSegment);  // Asynchronní volání
        }

        lastRMS = rms;  // Uložení poslední RMS pro další porovnání
    }
}

function deleteHeader(wavBuffer) {
    const headerSize = 44;
    const data = wavBuffer.slice(headerSize);
    return data;
}

module.exports = { calculateRMSFromWav };
