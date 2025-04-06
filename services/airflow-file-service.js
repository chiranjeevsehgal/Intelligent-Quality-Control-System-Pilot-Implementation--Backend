const axios = require('axios');
const { broadcastToClients }  = require('../controllers/websocket.controller');
const fs = require('fs');
const path = require('path');
const app = require('../app');
const config = require('../config');
const wss = app.get("wss");

async function handleFileChange(filePath) {
    
    try {

        broadcastToClients(wss, filePath)
        // console.log("In airflow controller\n"+filePath);
        console.log("file path:\n"+filePath);
        
        const response = await axios.post('http://localhost:5001/api/process-image', { filePath });

        broadcastResult({
            fileName: path.basename(filePath),
            filePath,
            result: response.data.result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error(`Error processing ${filePath}:`);
        broadcastError({
            fileName: path.basename(filePath),
            error: error.response?.data?.error || error.message,
        });
    }
}

// Custom response function for the edge pipeline
function broadcastResult(data) {
    const filePath = data.filePath
    const fileBuffer = fs.readFileSync(filePath);

    const base64Image = fileBuffer.toString('base64');
    const mimeType = 'image/jpeg';
    const message = {
        type: 'LOCAL_FILE_RESULT',
        data: {
            ...data,
            previewData: `data:${mimeType};base64,${base64Image}`,
            status: 'completed'
        }
    };
    broadcastToClients(wss, message);
    
}

// Custom error function for the edge pipeline
function broadcastError(data) {
    const message = {
        type: 'LOCAL_FILE_ERROR',
        data: {
            ...data,
            timestamp: new Date().toISOString()
        }
    };
    broadcastToClients(wss, message);
}

module.exports = {
    handleFileChange
};