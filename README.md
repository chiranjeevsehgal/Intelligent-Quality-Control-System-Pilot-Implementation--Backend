# AI-Based Defect Detection Pilot Implementation – Backend

## Overview
This is the backend for the **AI-Based Defect Detection Pilot Implementation**, designed to support defect analysis in paper sheets using **Gemini 1.5 Pro API** and **Ollama Gemma3 model**. The backend is responsible for handling API calls, facilitating WebSocket communication.

## Features
- **AI Analysis API**: Supports defect detection using **Gemini** and **Ollama Gemma3**.
- **Automated Workflow**: Integrates **Google Drive & AppScript** for automatic defect detection from uploaded files.
- **WebSocket Support**: Enables real-time communication for status updates.
- **Modular Architecture**: Well-structured controllers, routes, and services for scalability.

## Tech Stack
- **Backend**: Node.js (Express.js)
- **AI Services**: Gemini, Ollama Gemma3
- **Automation**: Google Drive API, AppScript
- **Communication**: WebSockets

## Project Structure
```
├── node_modules/
├── config/
│   ├── index.js
├── controllers/
│   ├── analysis.controller.js
│   ├── drive.controller.js
│   ├── websocket.controller.js
├── routes/
│   ├── analysis.routes.js
│   ├── drive.routes.js
│   ├── websocket.routes.js
├── services/
│   ├── drive.service.js
│   ├── gemini.service.js
├── .env
├── .gitignore
├── .gitattributes
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── app.js
├── server.js
├── README.md
├── vite.config.js
```

## **Installation**
```sh
# Clone the repository
git clone https://github.com/chiranjeevsehgal/Intelligent-Quality-Control-System-Pilot-Implementation--Backend.git
cd Intelligent-Quality-Control-System-Pilot-Implementation--Backend

# Install dependencies
npm install

# Create a .env file and configure necessary environment variables
GEMINI_API_KEY = <YOUR_GEMINI_API_KEY>
GEMINI_MODEL = <MODEL_NAME>
PORT = <YOUR_PORT>
    
# Start the backend server
npm start
