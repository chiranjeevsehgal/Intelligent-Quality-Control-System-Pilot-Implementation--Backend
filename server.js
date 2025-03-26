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
    console.log(`✅ New WebSocket client connected! Total clients: ${wss.clients.size}`);

    ws.on("message", (message) => {
        console.log("📩 Message from client:", message);
    });
    ws.on("close", () => {
        console.log(`❌ Client disconnected. Remaining clients: ${wss.clients.size}`);
    });
    
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

    console.log(wss.clients)
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

app.get('/get-image', async (req, res) => {
    try {
      const { fileId } = req.query;
      const response = await axios.get(`https://drive.google.com/uc?export=view&id=${fileId}`, {
        responseType: 'arraybuffer'
      });
      
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      res.json({ 
        mimeType: response.headers['content-type'],
        data: `data:${response.headers['content-type']};base64,${base64}`
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  });

// Routes
app.get('/', (req, res) => res.send('API is running...'));

// Export the Express app

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;