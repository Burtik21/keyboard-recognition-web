const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Kontroler pro registraci uživatele
exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Validace, zda jsou všechna pole vyplněná
        if (!username || !password || !email) {
            return res.render('register', {  // Vrátí uživatele zpět na registrační stránku
                error: 'Všechna pole jsou povinná.',
                username,
                email
            });
        }

        // Zkontroluj, zda uživatel s tímto jménem nebo emailem již existuje
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.render('register', {
                error: 'Uživatel s tímto uživatelským jménem již existuje.',
                username,
                email
            });
        }

        // Hashování hesla
        const hashedPassword = await bcrypt.hash(password, 10);  // Hashování hesla

        // Vytvoření nového uživatele
        const newUser = await User.create({
            username: username,
            password_hash: hashedPassword,  // Uložení hashovaného hesla
            email: email
        });

        // Úspěšná registrace, přesměrování na přihlašovací stránku
        res.status(201).send('Uživatel byl úspěšně zaregistrován');
    } catch (error) {
        console.error('Chyba při registraci uživatele:', error);
        res.status(500).send('Chyba serveru');
    }
};

// ✅ Přihlášení uživatele
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.render('login', {  // Zobrazení chybové zprávy na přihlašovací stránce
                error: 'Nesprávný email nebo heslo.',
                email
            });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash); // Opravený přístup k hashovanému heslu
        if (!isMatch) {
            return res.render('login', {
                error: 'Nesprávný email nebo heslo.',
                email
            });
        }

        req.session.userId = user.id;
        res.redirect('/keyboard');
    } catch (error) {
        console.error('❌ Chyba při přihlášení:', error);
        res.status(500).send('Chyba při přihlášení.');
    }
};

// ✅ Odhlášení uživatele
exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('❌ Chyba při odhlášení:', err);
        }
        res.redirect('/keyboard/auth/login');
    });
};
