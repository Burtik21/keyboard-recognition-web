const Meyda = require('meyda');

async function processSegment(segment) {
    console.log("Procesování segmentu...");

    // 1. Spojit všechny buffery z frame segmentu
    const int16 = [];
    segment.forEach(frame => {
        const frameSamples = new Int16Array(frame);
        int16.push(...frameSamples);
    });

    // 2. Převést na Float32Array pro Meydu (-1.0 až 1.0)
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
    }

    // 3. Nastavit buffer size, hop size
    const bufferSize = 1024;
    const sampleRate = 44100;
    const featuresOverTime = [];

    // 4. Posuvné okno přes signál
    for (let i = 0; i < float32.length - bufferSize; i += bufferSize) {
        const frame = float32.slice(i, i + bufferSize);
        const features = Meyda.extract(
            [
                'rms', 'zcr', 'spectralCentroid', 'spectralBandwidth',
                'spectralRolloff', 'mfcc'
            ],
            frame,
            { sampleRate }
        );

        if (features) {
            featuresOverTime.push(features);
        }
    }

    // 5. Vypočítat průměry přes všechny framy
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const result = {
        rms: avg(featuresOverTime.map(f => f.rms)),
        zcr: avg(featuresOverTime.map(f => f.zcr)),
        spectral_centroid: avg(featuresOverTime.map(f => f.spectralCentroid)),
        spectral_bandwidth: avg(featuresOverTime.map(f => f.spectralBandwidth)),
        spectral_rolloff: avg(featuresOverTime.map(f => f.spectralRolloff)),
        // MFCC zpracujeme níže
    };

    // 6. Vynechání některých MFCC (např. 5, 9, 10, 11, 12)
    const skip = [5, 9, 10, 11, 12]; // tyto MFCC čísla nechceš
    const mfccAvg = Array.from({ length: 13 }, (_, i) => avg(featuresOverTime.map(f => f.mfcc[i])));

    mfccAvg.forEach((val, i) => {
        const index = i + 1; // MFCC_1 má index 0 + 1
        if (skip.includes(index)) return; // přeskoč, pokud je ve skip listu
        result[`mfcc_${index}`] = val;
    });

    // 7. Extra metriky
    result.duration = float32.length / sampleRate; // délka segmentu
    result.max_intensity = Math.max(...float32.map(Math.abs)); // maximální intenzita
    result.dominant_freq = getDominantFreq(float32, sampleRate); // dominantní frekvence

    console.log("🎧 Analyzovaný segment:", result);
    return result;
}

// Funkce pro získání dominantní frekvence pomocí FFT
function getDominantFreq(signal, sampleRate) {
    const fft = require("fft-js").fft;
    const fftUtil = require("fft-js").util;

    const phasors = fft(signal);
    const mags = fftUtil.fftMag(phasors);

    const maxIndex = mags.indexOf(Math.max(...mags));
    const freqs = fftUtil.fftFreq(phasors, sampleRate);

    return freqs[maxIndex]; // dominantní frekvence
}

module.exports = { processSegment };
