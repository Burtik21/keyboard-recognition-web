const bcrypt = require('bcryptjs');
const User = require('../models/User');


// Kontroler pro registraci uživatele
exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Validace, zda jsou všechna pole vyplněná
        if (!username || !password || !email) {
            return res.status(400).send('Všechna pole jsou povinná.');
        }

        // Zkontroluj, zda uživatel s tímto jménem nebo emailem již existuje
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).send('Uživatel s tímto uživatelským jménem již existuje.');
        }

        // Hashování hesla
        const hashedPassword = await bcrypt.hash(password, 10);  // Hashování hesla

        // Vytvoření nového uživatele
        const newUser = await User.create({
            username: username,
            password_hash: hashedPassword,  // Uložení hashovaného hesla
            email: email
        });

        // Vrácení úspěšné odpovědi
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
            return res.status(400).send('Nesprávný email nebo heslo.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Nesprávný email nebo heslo.');
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
