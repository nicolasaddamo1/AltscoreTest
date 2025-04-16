require('dotenv').config();
const axios = require('axios');

const baseURL = process.env.BASE_URL;
const token = process.env.API_KEY;
const solutionURL = process.env.SOLUTION_URL;

const HEADERS = {
  'API-KEY': token,
  'Accept': 'application/json',
};

async function getAllStars() {
    const uniqueStars = new Map(); // id => resonance
    let page = 1;
  
    while (uniqueStars.size < 100) {
      try {
        const response = await axios.get(`${baseURL}?page=${page}`, {
          headers: HEADERS,
        });
  
        const stars = response.data;
        console.log(`Página ${page} devuelve ${stars.length} estrellas`);
        console.log(stars);
  
        for (const star of stars) {
          uniqueStars.set(star.id, star.resonance);
        }
  
        if (stars.length === 0) break; // Corte defensivo si no hay más data
        page++;
  
      } catch (err) {
        console.error(`Error en página ${page}:`, err.message);
        break;
      }
    }
  
    console.log(`✨ Total de estrellas únicas recolectadas: ${uniqueStars.size}`);
    return Array.from(uniqueStars.values());
  }
  

async function submitSolution(average) {
  try {
    console.log (average);
    const response = await axios.post(solutionURL, {
      average_resonance: average
    }, {
      headers: {
        ...HEADERS,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Solución enviada correctamente:');
    console.log(response.data);
  } catch (error) {
    console.error('❌ Error al enviar la solución:', error.message);
    if (error.response) console.error(error.response.data);
  }
}

(async () => {
  const resonanceValues = await getAllStars();
  const total = resonanceValues.reduce((acc, val) => acc + val, 0);
  console.log(resonanceValues.length)
  const average = Math.floor(total / resonanceValues.length);

  console.log(`🔭 Resonancia promedio calculada: ${average}`);
  await submitSolution(average);
})();
