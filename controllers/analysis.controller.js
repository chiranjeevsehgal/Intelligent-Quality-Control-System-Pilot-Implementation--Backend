const { analyzeImageFromGeminiUploadService, analyzeImageFromCloudPipelineService }  = require('../services/gemini.service');

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

module.exports = {
    analyzeImageFromCloudPipeline,
    analyzeImageFromGeminiUpload 
};