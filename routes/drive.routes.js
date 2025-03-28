const express = require('express');
const router = express.Router();
const driveController = require('../controllers/drive.controller');

router.get('/get-image', driveController.getImage);

module.exports = router;