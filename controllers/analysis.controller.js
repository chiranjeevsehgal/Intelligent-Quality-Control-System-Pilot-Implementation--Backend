const { classifyImage,analyzeImage }  = require('../services/gemini.service');

const analyzeImageController = async (req, res) => {
    try {
        const { imageData } = req.body;
        if (!imageData) {
            return res.status(400).json({ error: "Image data is required" });
        }

        const result = await analyzeImage(imageData);
        res.json({ result });
    } catch (error) {
        console.error("Gemini API error:", error.response?.data || error.message);
        res.status(500).json({ error: "Analysis failed" });
    }
};

const classifyPaperImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const result = await classifyImage(req.file.buffer, req.file.mimetype);
        res.json({ classification: result });

    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    analyzeImageController,
    classifyPaperImage
};