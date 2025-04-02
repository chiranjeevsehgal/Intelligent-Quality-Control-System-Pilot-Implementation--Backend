require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
};