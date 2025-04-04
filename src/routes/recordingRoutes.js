const express = require('express');
const router = express.Router();
const recordingsController = require('../controllers/recordingsController');

// Zobrazení všech nahrávek
router.get('/', recordingsController.getAllRecordings);

module.exports = router;
