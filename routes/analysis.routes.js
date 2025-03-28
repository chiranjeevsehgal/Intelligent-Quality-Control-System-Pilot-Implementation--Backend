const express = require('express');
const router = express.Router();
// const analysisController = require('../controllers/analysis.controller');
const { classifyPaperImage, analyzeImageController} = require("../controllers/analysis.controller");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });


router.post('/analyze-image', analyzeImageController);

router.post("/classify-image", upload.single("image"), classifyPaperImage);

module.exports = router;