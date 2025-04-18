require('dotenv').config();
const axios = require('axios');

const url = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const HEADERS = {
  'API-KEY': API_KEY,
  'Content-Type': 'application/json'
};

async function ex(){

    const formatedData = 
    {
    "heights": {
        "bug": 0.910,
        "dark": 1.017,
        "dragon": 2.187,
        "electric": 0.893,
        "fairy": 0.690,
        "fighting": 1.193,
        "fire": 1.183,
        "flying": 1.383,
        "ghost": 1.230,
        "grass": 0.947,
        "ground": 1.470,
        "ice": 1.333,
        "normal": 1.023,
        "poison": 1.157,
        "psychic": 1.240,
        "rock": 1.350,
        "steel": 1.487,
        "water": 1.260
    }
  };

   try {
        const response = await axios.post(url, formatedData, { headers: HEADERS });
        console.log("Respuesta del servidor:", response.data);
      } catch (error) {
        console.error("Error al enviar la solución:", error.message);
      }


}
ex();