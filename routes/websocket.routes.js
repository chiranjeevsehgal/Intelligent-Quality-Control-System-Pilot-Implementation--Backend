const express = require('express');
const router = express.Router();
const websocketController = require('../controllers/websocket.controller');

router.post("/webhook", websocketController.handleWebhook);

module.exports = router;