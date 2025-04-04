const bcrypt = require('bcryptjs');
//const Member = require('../models/Member');

// ✅ Registrace uživatele
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await Member.findOne({ where: { email } });
        if (existingUser) {
            return res.render('register', { 
                error: 'Uživatel s tímto emailem již existuje.',
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
        console.error('❌ Chyba při registraci:', error);
        res.render('register', { 
            error: '❌ Chyba při registraci. Zkontrolujte zadané údaje.', 
            name, 
            email 
        });
    }
};

// ✅ Přihlášení uživatele
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Member.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send('Nesprávný email nebo heslo.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Nesprávný email nebo heslo.');
        }

        req.session.userId = user.id;
        
        res.redirect('/catalog');
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
        res.redirect('/auth/login');
    });
};
