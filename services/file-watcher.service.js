// services/file-watcher.service.js
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const WebSocket = require("ws");
const axios = require('axios');
const { broadcastToClients }  = require('../controllers/websocket.controller');
let watcher;

// Using Chokidar to monitor the files
function initFileWatcher(wss) {
    
    // Create watch folder if it doesn't exist
    if (!fs.existsSync(config.WATCH_FOLDER)) {
        fs.mkdirSync(config.WATCH_FOLDER, { recursive: true });
    }

    watcher = chokidar.watch(config.WATCH_FOLDER, {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
        }
    });

    watcher
        .on('add', filePath => handleFileChange(filePath, wss))
        .on('change', filePath => handleFileChange(filePath, wss))
        .on('error', error => console.error('Watcher error:', error));

    return watcher;
}

// Helper function to process the image and broadcast the response
async function handleFileChange(filePath, wss) {
    
    try {
        const response = await axios.post('http://localhost:5001/api/process-image', { filePath });

        broadcastResult(wss, {
            fileName: path.basename(filePath),
            filePath,
            result: response.data.result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error(`Error processing ${filePath}:`);
        broadcastError(wss, {
            fileName: path.basename(filePath),
            error: error.response?.data?.error || error.message,
        });
    }
}

// Custom response function for the edge pipeline
function broadcastResult(wss, data) {
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
function broadcastError(wss, data) {
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
    initFileWatcher,
    handleFileChange
};