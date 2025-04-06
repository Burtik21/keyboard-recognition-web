const MobileDetect = require('mobile-detect');
const UserSession = require('../models/UserSession');  // Model pro session
const logger = require('../utils/logger');
// Middleware pro kontrolu přihlášení na více zařízeních a detekci mobilu vs PC
const checkMultipleDevicesAndDeviceType = async (req, res, next) => {
    const userId = req.session.userId;  // Uživatelské ID získáme z session
    const userAgent = req.get('User-Agent');  // Získáme User-Agent ze hlavičky požadavku

    try {
        // Detekce zařízení (mobil nebo desktop)
        const md = new MobileDetect(userAgent);
        const isMobile = md.mobile();  // Pokud je mobilní zařízení, vrátí true
        const deviceType = isMobile ? 'mobile' : 'desktop';  // Určíme, zda jde o mobil nebo desktop

        // Uložíme informaci o zařízení do res.locals pro pozdější použití v controlleru
        res.locals.deviceType = deviceType;

        /* Získáme všechny aktivní session pro tohoto uživatele

*/
        next();
    } catch (error) {
        console.error('❌ Chyba při kontrole zařízení:', error);
        return res.status(500).send('Chyba při ověřování zařízení.');
    }
};

module.exports = { checkMultipleDevicesAndDeviceType };
