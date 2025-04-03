const fs = require('fs');
const logger = require('../utils/logger');
const {convertChunkToWavBuffer} = require('../../vendor/audioConvert');
const {calculateRMSFromWav} = require('../services/eventDetector');
const path = require('path');

exports.handleSocket = (socket) => {
    logger.info('🟢 WebSocket připojen');

    const fileName = `audio_${Date.now()}.webm`;
    const filePath = path.join(__dirname, '../../recordings', fileName);
    const stream = fs.createWriteStream(filePath);

    // Fronta pro zpracování chunků
    let processingQueue = [];

    socket.on('message', (chunk) => {
        // Zapisujeme do souboru
        stream.write(chunk);
        logger.info(`📥 Přijat audio chunk (${chunk.length} bajtů)`);

        // Vytvoříme nový úkol pro zpracování tohoto chunku
        processChunk(chunk).then(() => {
            logger.info(`✅ Zpracování chunku dokončeno`);
        }).catch((err) => {
            logger.error('Chyba při zpracování chunku:', err);
        });
    });

    socket.on('close', () => {
        logger.info('🔴 WebSocket odpojen, uzavírám soubor.');
        stream.end();
    });

    // Funkce pro zpracování jednoho chunku
    async function processChunk(chunk) {
        try {
            // Převeď chunk na WAV buffer
            const wabBuf = await convertChunkToWavBuffer(chunk);
            logger.info(`WAV buffer přijat, délka: ${wabBuf.length}`);

            // Zkontroluj, jestli není prázdný buffer
            if (wabBuf.length === 0) {
                logger.error('WAV buffer je prázdný, chunk nebude zpracován.');
                return;
            }

            // Vypočítej RMS pro tento WAV buffer
            await calculateRMSFromWav(wabBuf);
            logger.info(`RMS výpočet dokončen pro chunk`);
        } catch (err) {
            logger.error('Chyba při zpracování chunku:', err);
        }
    }
};
