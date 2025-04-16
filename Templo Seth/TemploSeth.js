// TemploSeth.js
require('dotenv').config();
const axios = require('axios');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// SWAPI endpoints para personas
const SWAPI_BASE = "https://swapi.dev/api";
const PEOPLE_ENDPOINT = `${SWAPI_BASE}/people/`;

// Variables de entorno para el reto Jedi
const BASE_URL = process.env.BASE_URL; // e.g. https://makers-challenge.altscore.ai/v1/s1/e3
const API_KEY = process.env.API_KEY;     // tu API key
const ROLLODEX_ENDPOINT = `${BASE_URL}${process.env.ROLLODEX_ENDPOINT}`; // e.g. /resources/oracle-rolodex
const SOLUTION_ENDPOINT = `${BASE_URL}${process.env.SOLUTION_ENDPOINT}`; // e.g. /solution

const HEADERS = {
    'API-KEY': API_KEY,
    'Accept': 'application/json',
};

// Función para decodificar Base64
const atob = (str) => Buffer.from(str, 'base64').toString('utf-8');

/**
 * Obtiene todos los personajes de SWAPI, recorriendo las páginas.
 */
async function getAllPeople() {
    let people = [];
    let url = PEOPLE_ENDPOINT;
    while (url) {
        try {
            const res = await axios.get(url);
            people = people.concat(res.data.results);
            url = res.data.next; // SWAPI devuelve 'next' para la siguiente página (o null al final)
        } catch (e) {
            console.error("Error obteniendo personas:", e.message);
            break;
        }
    }
    return people;
}

/**
 * Consulta el Oráculo Jedi para determinar la alineación del personaje.
 * El endpoint requiere el parámetro query 'name'.
 */
async function getOracleAlignment(personName) {
    const url = `${ROLLODEX_ENDPOINT}?name=${encodeURIComponent(personName)}`;
    try {
        const response = await axios.get(url, { headers: HEADERS });
        const encodedMessage = response.data.oracle_notes;
        const decodedMessage = atob(encodedMessage);
        // Decodificamos la orientación del mensaje
        if (decodedMessage.includes("Light Side")) {
            return "light";
        } else if (decodedMessage.includes("Dark Side")) {
            return "dark";
        } else {
            return "unknown";
        }
    } catch (e) {
        console.error(`Error en el oráculo para ${personName}:`, e.message);
        return "unknown";
    }
}

/**
 * Calcula el IBF para cada planeta.
 * Agrupa por homeworld (URL) y calcula:
 * IBF = (número_luz - número_oscuro) / total_personajes
 * Retorna el primer planeta que tenga IBF cercano a 0 (dentro de un umbral)
 */
async function calculateEquilibriumPlanet() {
    const people = await getAllPeople();
    console.log(`Total de personajes de SWAPI: ${people.length}`);

    // Estructura para agrupar resultados por planeta (clave: URL del homeworld)
    const planetMap = {}; // { planetUrl: { light: count, dark: count, total: count, persons: [] } }

    for (const person of people) {
        console.log(`Consultando oráculo para ${person.name}...`);
        // Consultamos al oráculo para cada personaje
        const alignment = await getOracleAlignment(person.name);
        const planet = person.homeworld;
        if (!planetMap[planet]) {
            planetMap[planet] = { light: 0, dark: 0, total: 0, persons: [] };
        }
        if (alignment === "light") {
            planetMap[planet].light += 1;
        } else if (alignment === "dark") {
            planetMap[planet].dark += 1;
        }
        planetMap[planet].total += 1;
        planetMap[planet].persons.push({ name: person.name, alignment });
    }

    let equilibriumPlanet = null;
    const epsilon = 0.001;
    for (const planet in planetMap) {
        const counts = planetMap[planet];
        const ibf = (counts.light - counts.dark) / counts.total;
        console.log(`Planeta: ${planet} => IBF: ${ibf.toFixed(3)} (Luz: ${counts.light}, Oscuro: ${counts.dark}, Total: ${counts.total})`);
        if (Math.abs(ibf) < epsilon) {
            equilibriumPlanet = { planet, ibf, counts };
            break;
        }
    }
    return equilibriumPlanet;
}

/**
 * Envía la solución al endpoint de solución.
 * Según la documentación, se espera en el body un objeto con una clave, por ejemplo, "equilibrium_planet".
 */
async function submitSolution(data) {
    try {
        console.log("▶️ Dentro de submitSolution, body:", data);
        const response = await axios.post(SOLUTION_ENDPOINT, data, {
            headers: { ...HEADERS, 'Content-Type': 'application/json' }
        });
        console.log("✅ Solución enviada correctamente:", response.data);
    } catch (e) {
        console.error("❌ Error enviando la solución:", e.message);
        if (e.response) console.error(e.response.data);
    }
}

(async () => {
    const equilibrium = await calculateEquilibriumPlanet();
    // 1) Obtenés la info del planeta desde SWAPI
    const planetRes = await axios.get(equilibrium.planet);
    const planetName = planetRes.data.name;
    console.log("🌍 Nombre del planeta en equilibrio:", planetName);

    // 2) Preparás el payload con el nombre
    const payload = { planet: planetName };
    console.log("▶️ Enviando payload corregido:", payload);

    // 3) Enviás
    await submitSolution(payload);

})();