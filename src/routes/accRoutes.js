const express = require('express');
const router = express.Router();
const bookController = require('../controllers/accController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const accController = require('../controllers/accController');

// Výpis katalogu knih
router.get('/'/*, isAuthenticated*/, accController.member);
router.post("/edit"/*,isAuthenticated*/,accController.editAccField);


module.exports = router;
