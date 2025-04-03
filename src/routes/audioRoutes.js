const express = require('express');
const router = express.Router();
const multer = require('multer');
const audioController = require('../controllers/audioController');
const path = require('path');


//udelano s chatem, ukladani filu z endpointu
const uploadFolder = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname)
});
const upload = multer({ storage });

// Cesta: POST /keyboard/audio/upload
router.post('/upload', upload.single('audio_data'), audioController.uploadAudio);
// routes/audioRoutes.js


router.get('/', audioController.getAudioPage); // /keyboard/audio/

module.exports = router;
