// turno1-lectura.js
require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const HEADERS = {
  'API-KEY': API_KEY,
  'Content-Type': 'application/json'
};

const START_URL = `${BASE_URL}/actions/start`;
const TURN_URL = `${BASE_URL}/actions/perform-turn`;

(async () => {
  try {
    // Paso 1: Iniciar la batalla
    console.log('🟢 Iniciando la batalla...');
    const start = await axios.post(START_URL, {}, { headers: HEADERS });
    console.log('✅ Juego iniciado:', start.data);

    // Paso 2: Turno 1 - Leer el radar
    console.log('🔍 Ejecutando turno 1: leer radar...');
    const readTurn = await axios.post(TURN_URL, { action: 'read' }, { headers: HEADERS });

    console.log('📡 Lectura del radar:');
    console.log(readTurn.data);

  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
})();
