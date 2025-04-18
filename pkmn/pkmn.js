require('dotenv').config();
const axios = require('axios');
const API_KEY = process.env.API_KEY;
const HEADERS = {
  'API-KEY': API_KEY,
  'Content-Type': 'application/json'
};

const POKEAPI_TYPES_URL = 'https://pokeapi.co/api/v2/type';
const url = process.env.BASE_URL;

const pokemonTypes = [
  "bug", "dark", "dragon", "electric", "fairy", "fighting", 
  "fire", "flying", "ghost", "grass", "ground", "ice", 
  "normal", "poison", "psychic", "rock", "steel", "water"
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTypeData(type) {
  try {
    console.log(`Obteniendo datos para el tipo: ${type}`);
    const response = await axios.get(`${POKEAPI_TYPES_URL}/${type}`);
    await delay(300);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener datos para el tipo ${type}:`, error.message);
    return null;
  }
}

async function getPokemonHeight(url) {
  try {
    const response = await axios.get(url);
    await delay(200);
    return response.data.height / 10;
  } catch (error) {
    console.error(`Error al obtener altura del Pokémon:`, error.message);
    await delay(1000);
    return null;
  }
}

async function calculateAverageHeight(type) {
  try {
    const typeData = await getTypeData(type);
    if (!typeData || !typeData.pokemon) {
      console.error(`No se encontraron datos para el tipo ${type}`);
      return 0;
    }

    console.log(`Calculando altura promedio para ${typeData.pokemon.length} Pokémon del tipo ${type}`);
    
    let totalHeight = 0;
    let count = 0;
    
    const pokemonToProcess = Math.min(typeData.pokemon.length, 30);
    
    for (let i = 0; i < pokemonToProcess; i++) {
      const pokemonUrl = typeData.pokemon[i].pokemon.url;
      const height = await getPokemonHeight(pokemonUrl);
      
      if (height && height > 0) {
        totalHeight += height;
        count++;
      }
    }
    
    if (count === 0) return 0;
    
    const avgHeight = totalHeight / count;
    console.log(`Altura promedio para el tipo ${type}: ${avgHeight.toFixed(3)}`);
    return avgHeight;
  } catch (error) {
    console.error(`Error calculando altura para el tipo ${type}:`, error.message);
    return 0;
  }
}

async function main() {
  try {
    const heightsObject = {};
    
    for (const type of pokemonTypes) {
      const avgHeight = await calculateAverageHeight(type);
      heightsObject[type] = avgHeight;
      await delay(500);
    }
    
    // Crear objeto con valores formateados como strings con 3 decimales
    const formattedHeights = {};
    for (const type in heightsObject) {
      formattedHeights[type] = Number(heightsObject[type].toFixed(3));
    }
    
    console.log("Alturas promedio formateadas:", formattedHeights);
    
    // Preparar la solución con los valores formateados
    const solution = { heights: formattedHeights };
    console.log("Solución a enviar:", JSON.stringify(solution, null, 2));
    
    // Enviar la solución
    try {
      const response = await axios.post(url, solution, { headers: HEADERS });
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al enviar la solución:", error.message);
    }
  } catch (error) {
    console.error("Error en la ejecución principal:", error);
  }
}

main();