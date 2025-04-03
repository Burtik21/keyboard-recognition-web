const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { PassThrough } = require('stream');
const logger = require('../src/utils/logger');

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Převádí WebM chunk (Buffer) na WAV Buffer v paměti
 * @param {Buffer} chunk - WebM data
 * @returns {Promise<Buffer>} - WAV audio v paměti
 */
const convertChunkToWavBuffer = (chunk) => {
    return new Promise((resolve, reject) => {
        // Vytvoření PassThrough streamu pro WebM vstup
        const inputStream = new PassThrough();
        inputStream.end(chunk);  // WebM chunk je vložen do streamu

        const chunks = [];
        const outputStream = new PassThrough();

        // Posloucháme na "data" event pro získání výstupu z ffmpeg
        outputStream.on('data', (data) => {
            chunks.push(data);
            logger.info(`Data přijata z ffmpeg, velikost: ${data.length}`);  // Log velikosti dat z ffmpeg
        });

        outputStream.on('end', () => {
            logger.info(`Převod dokončen. Celková délka bufferu: ${Buffer.concat(chunks).length}`);
            resolve(Buffer.concat(chunks));  // Vrátíme WAV buffer
        });

        outputStream.on('error', (err) => {
            logger.error('Chyba při zpracování výstupu ffmpeg:', err);
            reject(err);  // Pokud nastane chyba, odmítneme Promise
        });

        // Spustíme ffmpeg a zpracujeme vstupní WebM data na WAV
        ffmpeg(inputStream)
            .inputFormat('webm')
            .audioCodec('pcm_s16le')
            .format('wav')
            .audioChannels(1)
            .audioFrequency(44100)
            .on('error', (err) => {
                logger.error('Chyba při převodu s ffmpeg:', err);
                reject(err);
            })
            .pipe(outputStream);
    });
};

module.exports = { convertChunkToWavBuffer };
