const express = require('express');
const router = express.Router();
const driveController = require('../controllers/drive.controller');

// To get the image from google drive
router.get('/get-image', driveController.getImage);

module.exports = router;