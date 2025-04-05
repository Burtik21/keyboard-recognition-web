const express = require('express');
const router = express.Router();
const multer = require('multer');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { checkMultipleDevicesAndDeviceType } = require('../middleware/checkMultipleDevicesMiddleware');  // Naše nové middleware pro detekci zařízení

const audioController = require('../controllers/audioController');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),  // Cesta pro ukládání souboru
    filename: (req, file, cb) => {
        const uniqueName = Date.now();  // Použití času v milisekundách pro unikátní jméno
        cb(null, `${uniqueName}_${file.originalname}`);
    }
});
const upload = multer({ storage });

// Cesta: POST /keyboard/audio/upload
router.post('/upload', isAuthenticated,upload.single('audio_data'), audioController.uploadAudio);
// routes/audioRoutes.js


router.get('/', isAuthenticated,checkMultipleDevicesAndDeviceType, audioController.getAudioPage); // /keyboard/audio/

module.exports = router;
