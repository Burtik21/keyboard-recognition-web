const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {checkMultipleDevicesAndDeviceType} = require("../middleware/checkMultipleDevicesMiddleware");

// Registrace
router.get('/register', (req, res) => res.render('register'));
router.post('/register', authController.registerUser);

// Přihlášení
router.get('/login', (req, res) => res.render('login'));
router.post('/login',checkMultipleDevicesAndDeviceType, authController.loginUser);

// Odhlášení
router.get('/logout', authController.logoutUser);

module.exports = router;
