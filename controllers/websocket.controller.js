let latestFile = null;
const WebSocket = require("ws");

exports.handleWebSocketConnection = (wss) => {
  return (ws) => {
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
  };
};

exports.handleWebhook = (req, res) => {
  const wss = req.app.get("wss"); 
  const { files } = req.body;
  console.log("🔔 New Files Alert Received!");
  if (!wss) {
    console.error("❌ WebSocket Server not found in app");
    return res.status(500).json({ error: "WebSocket server unavailable." });
  }
  
  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "Invalid request, expected an array of files." });
  }

  latestFile = files;
  console.log(`📁 Received ${files.length} new files.`);

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      console.log("📤 Sending file list to WebSocket clients...");
      client.send(JSON.stringify(files));
    } else {
      console.warn("⚠️ Client is not open, skipping...");
    }
  });

  res.status(200).json({ message: "Webhook received successfully!" });
};