const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let latestFile = null;

// WebSocket connection
wss.on("connection", (ws) => {
    console.log("🔗 New WebSocket client connected!");
    if (latestFile) {
        ws.send(JSON.stringify(latestFile));
    }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
    const { fileName, fileUrl, createdTime } = req.body;
    console.log("🔔 New File Alert Received!");
    console.log(`📁 File Name: ${fileName}`);
    console.log(`🔗 File URL: ${fileUrl}`);
    console.log(`📅 Created Time: ${createdTime}`);

    latestFile = { fileName, fileUrl, createdTime };

    // Send update to all WebSocket clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            console.log("📤 Sending file to WebSocket clients...");
            client.send(JSON.stringify(latestFile));
        } else {
            console.warn("⚠️ Client is not open, skipping...");
        }
    });

    res.status(200).json({ message: "Webhook received successfully!" });
});

// Routes
app.get('/', (req, res) => res.send('API is running...'));

// Export the Express app
module.exports = app;
