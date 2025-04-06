const axios = require('axios');
require('dotenv').config();
const config = require('../config');

const GEMINI_API_KEY = config.GEMINI_API_KEY;
const GEMINI_MODEL = config.GEMINI_MODEL;

async function analyzeImageFromCloudPipelineService(imageData) {
    // Works for the image data being received from the cloud pipeline
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
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

async function analyzeImageFromGeminiUploadService(imageBuffer, mimeType) {
    // Works for the image data being received from upload module for Gemini
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

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

async function analyzeImageFromEdgePipelineService(base64Data) {
    // Works for the image data being received from the edge pipeline

    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    
    const requestBody = {
      contents: [
        {
          parts: [
            { text: "Carefully analyze the provided paper image and determine whether it is 'Defective' or 'Not Defective'. Identify defects such as marks, holes, folds, discoloration, or any other inconsistencies with high precision, even for minor flaws. Provide a classification as either 'Defective' or 'Not Defective' along with the reason or detected issues. If the image is not of paper, respond with 'The uploaded image does not align with the scope of this project. Please provide an image of sheets for defect detection.' without any further analysis." },
            { inlineData: { mimeType: "image/jpeg", data: base64Data.split(',')[1] } }
          ]
        }
      ]
    };
  
    try {
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) throw new Error(`API error: ${response.status}`);
  
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No valid response from AI";
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error("Gemini API request failed");
    }
  }


module.exports = {
    analyzeImageFromCloudPipelineService,
    analyzeImageFromGeminiUploadService,
    analyzeImageFromEdgePipelineService
};