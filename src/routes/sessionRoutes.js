
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/update', sessionController.updateSession);
router.get('/get-recording', sessionController.getRecordingId);



module.exports = router;