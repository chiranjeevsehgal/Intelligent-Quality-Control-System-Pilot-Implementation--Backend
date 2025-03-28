const http = require("http");
const WebSocket = require("ws");
const app = require('./app');
const config = require('./config');
const websocketController = require('./controllers/websocket.controller');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.set("wss", wss);

wss.on("connection", websocketController.handleWebSocketConnection(wss));

server.listen(config.PORT, () => {
  console.log(`🚀 Server is running on port ${config.PORT}`);
});