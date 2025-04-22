// Valiant2.js
require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const TURN_URL = `${BASE_URL}/actions/perform-turn`;

const HEADERS = {
  'API-KEY': API_KEY,
  'Content-Type': 'application/json'
};

(async () => {
  try {
    console.log(TURN_URL)
    console.log('🔍 Turno de lectura...');
    const res = await axios.post(TURN_URL, { action: 'read' }, { headers: HEADERS });
    console.log('📡 Lectura del radar recibida:');
    console.log(res.data);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
