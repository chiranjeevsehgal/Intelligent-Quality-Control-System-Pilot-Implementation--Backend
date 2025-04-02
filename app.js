const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const analysisRoutes = require('./routes/analysis.routes');
const driveRoutes = require('./routes/drive.routes');
const websocketRoutes = require('./routes/websocket.routes');

const app = express();

app.use(bodyParser.json({ limit: '100mb' }));  // JSON payload limit
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));  // URL-encoded payload limit

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: '100mb' }));


// Routes
app.use('/api', analysisRoutes);
app.use('/api/drive', driveRoutes);
app.use('/api/ws', websocketRoutes);

app.get('/', (req, res) => res.send('API is running...'));

app.get('/health', (req, res) => res.send('STATUS OK'));


module.exports = app;