const WebSocket = require("ws");
const app = require('./app');
const config = require('./config');
const websocketController = require('./controllers/websocket.controller');

const express = require("express");


// const server = app.listen(config.PORT, () => {
//   console.log(`🚀 Server is running on port ${config.PORT}`);
// });

const server = app.listen(config.PORT, '0.0.0.0', () => console.log(`Server running on port ${config.PORT}`));

const wss = new WebSocket.Server({ server });

app.set("wss", wss);

wss.on("connection", websocketController.handleWebSocketConnection(wss));