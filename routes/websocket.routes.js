const express = require('express');
const router = express.Router();
const websocketController = require('../controllers/websocket.controller');

router.post("/webhook", (req, res) => websocketController.handleWebhook(req, res, req.app.get("wss")));


module.exports = router;