require('dotenv').config();
const axios = require('axios');
const API_KEY = process.env.API_KEY;
const HEADERS = {
  'API-KEY': API_KEY,
  'Content-Type': 'application/json'
};
const url = process.env.BASE_URL;


async function pk(){

  const respuesta = {
    "heights": {
      "normal": 1.566,
      "fighting": 2.260,
      "flying": 1.660,
      "poison": 3.371,
      "ground": 1.932,
      "rock": 1.802,
      "bug": 1.953,
      "ghost": 1.473,
      "steel": 2.776,
      "fire": 2.899,
      "water": 2.276,
      "grass": 1.682,
      "electric": 1.649,
      "psychic": 1.621,
      "ice": 1.827,
      "dragon": 4.337,
      "dark": 2.006,
      "fairy": 1.941,
      "stellar": 0.000,
      "unknown": 0.000
    }
}
  

try {
      const response = await axios.post(url, respuesta, { headers: HEADERS });
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al enviar:", error.message);
    }
  }
  pk(); 