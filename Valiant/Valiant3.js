// Valiant3.js
require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const TURN_URL = `${BASE_URL}/actions/perform-turn`;

const HEADERS = {
  'API-KEY': API_KEY,
  'Content-Type': 'application/json'
};

// 🎯 Cambiá aquí las coordenadas si fuera necesario
const target = {
  x: 'e',
  y: 7
};

(async () => {
  try {
    console.log('💥 Disparando a:', target);
    const res = await axios.post(
      TURN_URL,
      { action: 'attack', attack_position: target },
      { headers: HEADERS }
    );
    console.log('✅ Resultado del disparo:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
