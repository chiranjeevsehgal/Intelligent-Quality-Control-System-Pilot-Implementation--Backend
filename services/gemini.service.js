const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function analyzeImage(imageData) {

    
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${GEMINI_API_KEY}`;
    
    const requestBody = {
        contents: [
            {
                parts: [
                    {
                      text: "Carefully analyze the provided paper image and determine whether it is 'Defective' or 'Not Defective'. Identify defects such as marks, holes, folds, discoloration, or any other inconsistencies with high precision, even for minor flaws. Provide a classification as either 'Defective' or 'Not Defective' along with the detailed reason or detected issues. If the image is not of paper, respond with 'The uploaded image does not align with the scope of this project. Please provide an image of sheets for defect detection.' without any further analysis. Give response in just normal string to be rendered, no markdown or nothing."
                    },
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: imageData.split(',')[1]
                        }
                    }
                ]
            }
        ]
    };

    try {
        const response = await axios.post(endpoint, requestBody);
        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error communicating with Gemini API:", error.response?.data || error.message);
        throw new Error("Failed to analyze image");
    }
};

async function classifyImage(imageBuffer, mimeType) {
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${GEMINI_API_KEY}`;

    // Convert image to Base64
    const imageBase64 = imageBuffer.toString("base64");

    const requestBody = {
        contents: [
            {
                parts: [
                    { text: "Carefully analyze the provided paper image and determine whether it is 'Defective' or 'Not Defective'. Identify defects such as marks, holes, folds, discoloration, or any other inconsistencies with high precision, even for minor flaws. Provide a classification as either 'Defective' or 'Not Defective' along with the reason or detected issues. If the image is not of paper, respond with 'The uploaded image does not align with the scope of this project. Please provide an image of sheets for defect detection.' without any further analysis." },
                    { inlineData: { mimeType, data: imageBase64 } }
                ]
            }
        ]
    };

    try {
        const response = await axios.post(endpoint, requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Error";
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to classify image");
    }
};

module.exports = {
    analyzeImage,
    classifyImage
};