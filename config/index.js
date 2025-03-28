require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash-001',
};