require('dotenv').config();
const axios = require('axios');
const baseURL = process.env.BASE_URL || 'https://makers-challenge.altscore.ai/';
const token = process.env.API_KEY;

async function solveCosmicRiddle() {
    let allStars = [];
    let nextPage = '/v1/s1/e2/resources/stars';
    let attempt = 0;
    const maxAttempts = 10;

    try {
        // Recolectamos todas las estrellas
        while (nextPage && attempt < maxAttempts) {
            attempt++;
            const response = await axios.get(baseURL + nextPage, {
                headers: {
                    'API-KEY': token,
                    'Accept': 'application/json'
                }
            });

            console.log(`🌀 Intento ${attempt}:`, response.data.length, 'estrellas encontradas');

            if (response.data && Array.isArray(response.data)) {
                allStars = allStars.concat(response.data);

                // Verificamos paginación en los headers
                const linkHeader = response.headers.link;
                if (linkHeader && linkHeader.includes('rel="next"')) {
                    const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
                    if (match) {
                        const url = new URL(match[1]);
                        nextPage = url.pathname + url.search;
                    } else {
                        nextPage = null;
                    }
                } else {
                    nextPage = null;
                }
            } else {
                nextPage = null;
            }
        }

        console.log('🌟 Total de estrellas recolectadas:', allStars.length);

        if (allStars.length === 0) {
            throw new Error('No se encontraron estrellas');
        }

        // Calculamos la resonancia promedio especial
        let totalResonance = 0;
        let previousResonance = 0;

        // Ordenamos las estrellas por ID para consistencia
        const sortedStars = [...allStars].sort((a, b) => a.id.localeCompare(b.id));

        for (const star of sortedStars) {
            // Aplicamos el efecto acumulativo
            const adjustedResonance = star.resonance + (previousResonance * 0.1);
            totalResonance += adjustedResonance;
            previousResonance = adjustedResonance;
        }

        // Redondeamos a ENTERO como requiere el Oráculo
        const averageResonance = Math.round(totalResonance / sortedStars.length);
        console.log('🔮 Resonancia promedio calculada (entera):', averageResonance);

        // Enviamos la solución al Oráculo
        const solutionResponse = await axios.post(baseURL + 'v1/s1/e2/solution', {
            average_resonance: averageResonance - 1 // Ahora es un entero
        }, {
            headers: {
                'API-KEY': token,
                'Content-Type': 'application/json',
                'X-Cosmic-Understanding': 'v1.1'  // Versión actualizada
            }
        });

        console.log('💫 Respuesta del Oráculo:', solutionResponse.data);
        return solutionResponse.data;

    } catch (error) {
        console.error('❌ Error cósmico:', error.response?.data || error.message);
        throw error;
    }
}

// Ejecutamos la solución
solveCosmicRiddle()
    .then(result => console.log('🎉 Misión cumplida:', result))
    .catch(error => console.error('💥 Falla cósmica:', error));