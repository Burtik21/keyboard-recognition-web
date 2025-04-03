const wavEncoder = require("wav-encoder");
const fs = require("fs");

async function processSegment(segment) {
    console.log('Procesování segmentu:', segment);

    const samples = [];

    segment.forEach(frame => {
        const audioData = new Int16Array(frame);
        samples.push(...audioData);
    });

    const wavData = {
        sampleRate: 44100,
        channelData: [samples]
    };

    try {
        const buffer = await wavEncoder.encode(wavData);  // Asynchronní enkódování
        fs.writeFileSync('detected_segment.wav', buffer);  // Uložení WAV souboru
        console.log('WAV soubor uložen jako "detected_segment.wav"');

        // Můžeš pokračovat s analýzou souboru
        analyzeWav('detected_segment.wav');
    } catch (err) {
        console.error('Chyba při ukládání WAV souboru:', err);
    }
}

async function analyzeWav(wavFilePath) {
    const Meyda = require('meyda');
    const fs = require('fs');

    const wavBuffer = fs.readFileSync(wavFilePath);
    const meydaFeatures = Meyda.extract(['zcr', 'mfcc'], wavBuffer);

    console.log('Zero Crossing Rate:', meydaFeatures.zcr);
    console.log('MFCC:', meydaFeatures.mfcc);
}

module.exports = { processSegment };
