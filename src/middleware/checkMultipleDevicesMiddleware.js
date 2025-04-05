const MobileDetect = require('mobile-detect');
const UserSession = require('../models/UserSession');  // Model pro session

// Middleware pro kontrolu přihlášení na více zařízeních a detekci mobilu vs PC
const checkMultipleDevicesAndDeviceType = async (req, res, next) => {
    const userId = req.session.userId;  // Uživatelské ID získáme z session
    const userAgent = req.get('User-Agent');  // Získáme User-Agent ze hlavičky požadavku

    if (!userId) {
        return res.status(401).send('Nejste přihlášeni.');
    }

    try {
        // Detekce zařízení (mobil nebo desktop)
        const md = new MobileDetect(userAgent);
        const isMobile = md.mobile();  // Pokud je mobilní zařízení, vrátí true
        const deviceType = isMobile ? 'mobile' : 'desktop';  // Určíme, zda jde o mobil nebo desktop

        // Uložíme informaci o zařízení do res.locals pro pozdější použití v controlleru
        res.locals.deviceType = deviceType;

        // Získání všech session pro tohoto uživatele
        const sessions = await UserSession.findAll({ where: { memberId: userId } });

        if (sessions.length > 1) {
            // Pokud existuje více než jedna session (přihlášení na více zařízeních)
            res.locals.multipleDevices = true;
        } else {
            res.locals.multipleDevices = false;
        }

        // Pokračujeme na další middleware nebo controller
        next();
    } catch (error) {
        console.error('❌ Chyba při kontrole zařízení:', error);
        return res.status(500).send('Chyba při ověřování zařízení.');
    }
};

module.exports = { checkMultipleDevicesAndDeviceType };
