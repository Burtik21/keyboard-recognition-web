const MobileDetect = require('mobile-detect');
const UserSession = require('../models/UserSession');  // Model pro session

// Middleware pro kontrolu přihlášení na více zařízeních a detekci mobilu vs. PC
const checkMultipleDevicesAndDeviceType = async (req, res, next) => {
    const userId = req.session.userId;  // Uživatelské ID získáme z session
    const userAgent = req.get('User-Agent');  // Získáme User-Agent ze hlavičky požadavku

    if (!userId) {
        return res.status(401).send('Nejste přihlášeni.');
    }

    try {
        // Získání všech session pro tohoto uživatele
        const sessions = await UserSession.findAll({ where: { memberId: userId } });

        // Vytvoříme pole pro všechny typy zařízení, která jsou aktuálně přihlášená
        const deviceTypes = [];

        // Pro každou session zjistíme její typ zařízení
        sessions.forEach(session => {
            const md = new MobileDetect(session.userAgent);  // Předpokládám, že v session je userAgent
            const deviceType = md.mobile() ? 'mobile' : 'desktop';  // Určíme typ zařízení pro každou session
            if (!deviceTypes.includes(deviceType)) {
                deviceTypes.push(deviceType);  // Přidáme typ zařízení, pokud už tam není
            }
        });

        // Uložíme všechny typy zařízení do res.locals pro použití v controlleru
        res.locals.deviceTypes = deviceTypes;

        // Zkontrolujeme, zda má uživatel více než jednu session (přihlášen na více zařízeních)
        res.locals.multipleDevices = sessions.length > 1;

        // Pokračujeme na další middleware nebo controller
        next();
    } catch (error) {
        console.error('❌ Chyba při kontrole zařízení:', error);
        return res.status(500).send('Chyba při ověřování zařízení.');
    }
};

module.exports = { checkMultipleDevicesAndDeviceType };
