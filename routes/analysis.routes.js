const express = require('express');
const router = express.Router();
const { analyzeImageFromGeminiUpload, analyzeImageFromCloudPipeline} = require("../controllers/analysis.controller");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// For the google drive pipeline automated analysis
router.post('/analyze-image', analyzeImageFromCloudPipeline);

// For the gemini file upload analysis
router.post("/classify-image", upload.single("image"), analyzeImageFromGeminiUpload);

module.exports = router;