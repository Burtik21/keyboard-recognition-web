const UserSession = require('../models/UserSession');  // Model pro session

// Metoda pro aktualizaci session (zahájení nebo zastavení nahrávání)
// Metoda pro aktualizaci session (zahájení nebo zastavení nahrávání)
exports.updateSession = async (req, res) => {
    const { recordingId, isRecording } = req.body;  // Získáme recordingId a isRecording z požadavku
    const sessionId = req.session.id;  // sessionId získáme z req.session

    console.log("session id je: " + sessionId);

    if (sessionId === undefined || recordingId === undefined || isRecording === undefined) {
        return res.status(400).json({ error: 'sessionId, recordingId a isRecording jsou povinné.' });
    }

    try {
        if (isRecording) {
            // Pokud isRecording je true, zjistíme, zda nějaká session již nahrává
            const existingRecording = await UserSession.findOne({
                where: { isRecording: true, active: true }  // Hledáme jakoukoliv aktivní session, která již nahrává
            });

            if (existingRecording) {
                // Pokud nějaká session již nahrává, vrátíme false
                return res.status(400).json({
                    isRecording: false,  // Oznámíme, že nahrávání již probíhá
                    recordingId: existingRecording.recordingId  // Vrátíme recordingId, které je aktivní
                });
            }

            // Najdeme specifickou session podle sessionId
            const session = await UserSession.findOne({
                where: { sessionId: sessionId }  // Hledáme podle sessionId
            });

            if (!session) {
                console.error(`Session s ID ${sessionId} nebyla nalezena.`);
                return res.status(404).json({ error: 'Session nebyla nalezena.' });
            }

            // Nastavíme isRecording na 1 (nahrávání začíná) a přiřadíme recordingId
            await session.update({
                isRecording: isRecording,  // Nastavíme, zda probíhá nahrávání
                recordingId: recordingId   // Přiřadíme recordingId
            });

            console.log(`Session ID: ${sessionId} byla aktualizována. isRecording: ${isRecording}, recordingId: ${recordingId}`);

            return res.status(200).json({
                message: `Session ID: ${sessionId} byla úspěšně aktualizována.`,
                isRecording: session.isRecording,
                recordingId: recordingId
            });
        } else {
            // Pokud isRecording je false, chceme zastavit nahrávání
            const session = await UserSession.findOne({
                where: { sessionId: sessionId }  // Hledáme podle sessionId
            });

            if (!session) {
                return res.status(404).json({ error: 'Session nebyla nalezena.' });
            }

            // Zastavíme nahrávání (isRecording na false) a odstraníme recordingId
            await session.update({
                isRecording: false,  // Zastavíme nahrávání
                recordingId: null    // Vyčistíme recordingId
            });

            console.log(`Session ID: ${sessionId} byla zastavena. isRecording: ${isRecording}`);

            return res.status(200).json({
                message: `Nahrávání bylo zastaveno pro session ID: ${sessionId}`,
                isRecording: false,
                recordingId: null
            });
        }
    } catch (error) {
        console.error('❌ Chyba při aktualizaci session:', error);
        return res.status(500).json({ error: 'Chyba při aktualizaci session.' });
    }
};

// Metoda pro získání recordingId pro aktivní session
exports.getRecordingId = async (req, res) => {
    const { sessionId } = req.query;  // sessionId z query parametru

    if (!sessionId) {
        return res.status(400).json({ error: 'sessionId je povinné.' });
    }

    try {
        // Zkontrolujeme, zda existuje aktivní session, která nahrává
        const session = await UserSession.findOne({
            where: { sessionId: sessionId, isRecording: true, active: true }  // Hledáme session, která nahrává
        });

        if (session) {
            // Pokud session nahrává, vrátíme recordingId
            return res.status(200).json({
                recordingId: session.recordingId  // Vracíme recordingId
            });
        } else {
            // Pokud žádná session nahrává, vrátíme chybovou zprávu
            return res.status(404).json({ error: 'Žádná session neprobíhá.' });
        }
    } catch (error) {
        console.error('❌ Chyba při získávání recordingId:', error);
        return res.status(500).json({ error: 'Chyba při získávání recordingId.' });
    }
};

