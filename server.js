const WebSocket = require("ws");
const app = require('./app');
const config = require('./config');
const websocketController = require('./controllers/websocket.controller');

const server = app.listen(config.PORT, '0.0.0.0', () => console.log(`Server running on port ${config.PORT}`));

const wss = new WebSocket.Server({ server });

app.set("wss", wss);

wss.on("connection", websocketController.handleWebSocketConnection(wss));