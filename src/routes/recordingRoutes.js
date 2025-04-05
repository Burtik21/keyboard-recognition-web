const express = require('express');
const router = express.Router();
const recordingsController = require('../controllers/recordingsController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Zobrazení všech nahrávek
router.get('/',isAuthenticated, recordingsController.getUserRecordings);
router.post("/create", isAuthenticated,recordingsController.createRecording);
router.post("/clicks", isAuthenticated,recordingsController.updateClickCount);


module.exports = router;
