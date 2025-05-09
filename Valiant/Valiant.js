// Valiant1.js
require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const START_URL = `${BASE_URL}/actions/start`;

const HEADERS = {
  'API-KEY': API_KEY,
  'Content-Type': 'application/json'
};

(async () => {
  try {
    console.log('🟢 Iniciando batalla...');
    const res = await axios.post(START_URL, {}, { headers: HEADERS });
    console.log('✅ Batalla iniciada:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
