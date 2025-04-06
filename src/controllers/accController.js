const Member = require('../models/Member');
const logger = require('../utils/logger');
// Načtení všech knih z databáze
exports.member = async (req, res) => {
    try {
        const user = await Member.findByPk(req.session.userId);
        res.render('account', { user });    // Předá je do EJS šablony
    } catch (error) {
        logger.error('Chyba při načítání usera:', error);  // Přidáno logování chyby
        res.status(500).send('Chyba při načítání usera');
    }
};
exports.editAccField = async (req, res) => {
    try {
        const { field, value } = req.body;
        const id = req.session.userId;
        const user = await Member.findByPk(id);
        if (!user) {
            return res.status(404).send('Uživatel nebyl nalezen.');
        }
        if (field == "name") {
            user.name = value;
            await user.save();
            return res.status(200).json({ message: 'name byl aktualizován.' });
        }
        if (field == "email") {
            user.email = value;
            await user.save();
            return res.status(200).json({ message: 'email byl aktualizován.' });
        }
        

        res.status(200).send('Údaje byly úspěšně aktualizovány.');
    }
    catch (error) {
        logger.error('❌ Chyba při aktualizaci údajů:', error);
        res.status(500).send('Chyba při aktualizaci údajů.');

    }
}
