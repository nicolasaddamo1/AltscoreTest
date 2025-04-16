require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL || 'https://makers-challenge.altscore.ai/v1/s1/e4';
const SOLUTION_URL = `${BASE_URL}/solution`;

const HEADERS = {
    'API-KEY': API_KEY,
    'Content-Type': 'application/json'
};

(async () => {
    const payload = {
        username: process.env.USR,
        password: process.env.PASS,
    };

    console.log('▶️ Enviando payload:', payload);

    try {
        const response = await axios.post(SOLUTION_URL, payload, {
            headers: HEADERS
        });
        console.log('✅ Respuesta:', response.data);
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
})();
