const bcrypt = require('bcryptjs');
const Member = require('../models/Member');
const UserSession = require('../models/UserSession'); // Import modelu UserSession
const logger = require('../utils/logger');


exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await Member.findOne({ where: { email } });
        if (existingUser) {
            return res.render('register', {
                error: '❌ Uživatel s tímto emailem již existuje.',
                name,
                email
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Member.create({
            name,
            email,
            password: hashedPassword
        });

        res.redirect('/auth/login');
    } catch (error) {
        logger.error('❌ Chyba při registraci:', error);
        res.render('register', {
            error: '❌ Chyba při registraci. Zkontrolujte zadané údaje.',
            name,
            email
        });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const { deviceType } = res.locals;

    try {
        const user = await Member.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send('Nesprávný email nebo heslo.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Nesprávný email nebo heslo.');
        }

        // Po úspěšném přihlášení uložíme uživatelské ID do session
        req.session.userId = user.id;

        // Vytvoříme novou session v databázi pro tohoto uživatele
        const newSession = await UserSession.create({
            memberId: user.id,
            deviceType: deviceType,  // Uložení deviceType do session
            isRecording: false,      // Inicializujeme isRecording na false (zatím nenahrává)
            recordingId: null,       // Inicializujeme recordingId na null (zatím žádná nahrávka)
            sessionId: req.session.id,  // Uložení session ID (z express-session) do databáze
        });

        res.redirect('/record');  // Po přihlášení přesměrujeme na stránku pro nahrávání

    } catch (error) {
        logger.error('❌ Chyba při přihlášení:', error);
        res.status(500).send('Chyba při přihlášení.');
    }
};



// ✅ Odhlášení uživatele
exports.logoutUser = async (req, res) => {
    try {
        // Deaktivujeme všechny session pro tohoto uživatele
        await UserSession.update(
            { active: false },  // Nastavíme active na false
            { where: { memberId: req.session.userId } }  // Pro všechny session tohoto uživatele
        );

        req.session.destroy(err => {
            if (err) {
                console.error('❌ Chyba při odhlášení:', err);
            }
            res.redirect('/auth/login');  // Přesměrování na login stránku po odhlášení
        });
    } catch (error) {
        logger.error('❌ Chyba při deaktivaci session:', error);
        res.status(500).send('Chyba při odhlášení.');
    }
};
