const fs = require('fs');
const path = require('path');

// Simulovaná databáze nahrávek
let recordings = [
    { id: 1, filename: 'audio1.webm', click_count: 10, created_at: '2025-04-04 12:30' },
    { id: 2, filename: 'audio2.webm', click_count: 5, created_at: '2025-04-04 13:15' },
];

// Kontroler pro získání všech nahrávek
exports.getAllRecordings = (req, res) => {
    res.render('recordingsPage', { recordings: recordings });
};


