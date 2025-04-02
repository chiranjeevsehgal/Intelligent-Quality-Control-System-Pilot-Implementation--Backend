const { analyzeImageFromGeminiUploadService, analyzeImageFromCloudPipelineService, analyzeImageFromEdgePipelineService }  = require('../services/gemini.service');
const fs = require('fs');
const path = require('path');
const { broadcastToClients }  = require('../controllers/websocket.controller');

const analyzeImageFromCloudPipeline = async (req, res) => {
    // Works for the image data being received from the cloud pipeline
    try {
        const { imageData } = req.body;
        if (!imageData) {
            return res.status(400).json({ error: "Image data is required" });
        }

        const result = await analyzeImageFromCloudPipelineService(imageData);
        res.json({ result });
    } catch (error) {
        console.error("Gemini API error:", error.response?.data || error.message);
        res.status(500).json({ error: "Analysis failed" });
    }
};

const analyzeImageFromGeminiUpload  = async (req, res) => {
    // Works for the image data being received from upload module for Gemini
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const result = await analyzeImageFromGeminiUploadService(req.file.buffer, req.file.mimetype);
        res.json({ classification: result });

    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const analyzeImageFromEdgePipeline = async (req, res) => {
    try {
      const { filePath } = req.body;
  
      if (!filePath || !fs.existsSync(filePath)) {
        return res.status(400).json({ success: false, error: "Invalid or missing file path" });
      }
  
      const fileExt = path.extname(filePath).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(fileExt)) {
        return res.status(400).json({ success: false, error: "Invalid file type" });
      }
  
      // Converts image to Base64
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
      const result = await analyzeImageFromEdgePipelineService(base64Data);
      const wss = req.app.get("wss");
  
      // Broadcast result to all connected WebSocket clients
      if (wss) {
        broadcastToClients(wss, { success: true, result });
      }
  
      res.json({ success: true, result });
    } catch (error) {
      console.error(`Processing error: ${error.message}`);
      res.status(500).json({ success: false, error: "Image processing failed" });
    }
  };
  

module.exports = {
    analyzeImageFromCloudPipeline,
    analyzeImageFromGeminiUpload,
    analyzeImageFromEdgePipeline
};