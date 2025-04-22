require('dotenv').config();
const axios = require('axios');
const API_KEY = process.env.API_KEY;
const HEADERS = {
  'API-KEY': API_KEY,
  'Content-Type': 'application/json'
};

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const url = process.env.BASE_URL;

// Variable para almacenar todos los tipos disponibles
let allPokemonTypes = [];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para obtener TODOS los tipos de Pokémon disponibles
async function getAllPokemonTypes() {
  try {
    console.log('Obteniendo todos los tipos de Pokémon...');
    const response = await axios.get(`${POKEAPI_BASE_URL}/type`);
    const types = response.data.results.map(type => type.name);
    console.log('Tipos encontrados:', types);
    return types.sort(); // Ordenamos alfabéticamente aquí
  } catch (error) {
    console.error('Error al obtener los tipos:', error.message);
    return [];
  }
}

async function getTypeData(type) {
  try {
    console.log(`Obteniendo datos para el tipo: ${type}`);
    const response = await axios.get(`${POKEAPI_BASE_URL}/type/${type}`);
    await delay(300);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener datos para el tipo ${type}:`, error.message);
    return null;
  }
}

async function getPokemonHeight(url, retries = 3) {
  try {
    const response = await axios.get(url);
    await delay(200);
    return response.data.height / 10;
  } catch (error) {
    if (retries > 0) {
      await delay(500);
      return getPokemonHeight(url, retries - 1);
    }
    console.error(`Error al obtener altura del Pokémon (${url}):`, error.message);
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

    console.log(`Procesando ${typeData.pokemon.length} Pokémon para el tipo ${type}`);
    
    let totalHeight = 0;
    let count = 0;
    
    for (const pokemon of typeData.pokemon) {
      const height = await getPokemonHeight(pokemon.pokemon.url);
      
      if (height !== null && height > 0) {
        totalHeight += height;
        count++;
      }
      await delay(100);
    }
    
    if (count === 0) return 0;
    
    const avgHeight = totalHeight / count;
    console.log(`Altura promedio para ${type}: ${avgHeight.toFixed(3)} (${count} Pokémon procesados)`);
    return avgHeight;
  } catch (error) {
    console.error(`Error calculando altura para ${type}:`, error.message);
    return 0;
  }
}

async function main() {
  try {
    // Obtenemos todos los tipos disponibles y los ordenamos alfabéticamente
    allPokemonTypes = await getAllPokemonTypes();
    
    const heightsObject = {};
    
    for (const type of allPokemonTypes) {
      const avgHeight = await calculateAverageHeight(type);
      heightsObject[type] = parseFloat(avgHeight.toFixed(3));
      await delay(500);
    }
    
    console.log("Resultados completos:", heightsObject);
    
    // Crear un objeto ordenado alfabéticamente
    const orderedHeights = {};
    Object.keys(heightsObject).sort().forEach(key => {
      orderedHeights[key] = heightsObject[key];
    });
    
    const solution = { heights: orderedHeights };
    console.log("Solución a enviar (ordenada alfabéticamente):", JSON.stringify(solution, null, 2));
    
    try {
      const response = await axios.post(url, solution, { headers: HEADERS });
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al enviar:", error.message);
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
      }
    }
  } catch (error) {
    console.error("Error en main:", error);
  }
}

main();