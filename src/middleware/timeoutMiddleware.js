const SESSION_TIMEOUT = 30 * 60 * 1000;  // 30 minut v milisekundách

// Middleware pro kontrolu neaktivity
const checkSessionTimeout = async (req, res, next) => {
    const currentTime = new Date().getTime();
    const lastActiveTime = req.session.lastActiveTime || currentTime;

    if (currentTime - lastActiveTime > SESSION_TIMEOUT) {
        // Pokud je session neaktivní více než 30 minut, deaktivujeme session
        await UserSession.update(
            { active: false },
            { where: { memberId: req.session.userId, active: true } } // Deaktivujeme session pro uživatele
        );
        req.session.destroy();  // Zničíme session
        return res.redirect('/auth/login');  // Přesměrování na login stránku
    }

    // Aktualizace poslední aktivity
    req.session.lastActiveTime = currentTime;
    next();
};

module.exports = checkSessionTimeout;
