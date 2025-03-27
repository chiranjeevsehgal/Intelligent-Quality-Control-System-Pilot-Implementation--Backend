const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const http = require("http");
const WebSocket = require("ws");

const axios = require('axios');
const stream = require('stream');

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
    const { files } = req.body; // Expect an array of files
    console.log("🔔 New Files Alert Received!");

    if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ error: "Invalid request, expected an array of files." });
    }

    latestFile = files; // Store the array of files

    console.log(`📁 Received ${files.length} new files.`);

    // Send updates to all WebSocket clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            console.log("📤 Sending file list to WebSocket clients...");
            client.send(JSON.stringify(files)); // Send entire array
        } else {
            console.warn("⚠️ Client is not open, skipping...");
        }
    });

    res.status(200).json({ message: "Webhook received successfully!" });
});


app.get('/get-image', async (req, res) => {
    try {
      const { fileId } = req.query;
      
      // First try direct download
      const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      
      const response = await axios({
        method: 'get',
        url: directUrl,
        responseType: 'stream',
        maxRedirects: 5 // Important for Google Drive
      });
  
      // Collect chunks and convert to base64
      const chunks = [];
      response.data.on('data', (chunk) => chunks.push(chunk));
      response.data.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        const contentType = response.headers['content-type'] || 'image/jpeg';
        
        res.json({
          mimeType: contentType,
          data: `data:${contentType};base64,${base64}`
        });
      });
  
      response.data.on('error', (err) => {
        console.error('Stream error:', err);
        res.status(500).json({ error: 'Failed to process image stream' });
      });
  
    } catch (error) {
      console.error('Full error:', error);
      
      // Special handling for Google Drive's virus scan warning
      if (error.response && error.response.data) {
        const html = error.response.data.toString();
        if (html.includes('Virus scan warning')) {
          return res.status(400).json({ 
            error: 'Google Drive virus scan warning',
            solution: 'Try downloading manually first to acknowledge warning'
          });
        }
      }
      
      res.status(500).json({ 
        error: 'Failed to fetch image',
        details: error.message 
      });
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