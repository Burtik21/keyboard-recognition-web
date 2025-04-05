const express = require('express');
const router = express.Router();
const recordingsController = require('../controllers/recordingsController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Zobrazení všech nahrávek
router.get('/',isAuthenticated, recordingsController.getAllRecordings);

module.exports = router;
