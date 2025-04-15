require('dotenv').config();
const axios = require('axios');

const baseURL = process.env.BASE_URL || 'https://makers-challenge.altscore.ai/';
const token = process.env.API_KEY;

async function getValidMeasurement(maxAttempts = 500) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`🔍 Intento ${attempt}...`);
        try {
            const response = await axios.get(`${baseURL}v1/s1/e1/resources/measurement`, {
                headers: {
                    'API-KEY': token,
                },
            });

            console.log('Datos recibidos:', response.data);

            // Verificar si los datos son válidos
            if (
                response.data &&
                response.data.distance !== undefined &&
                response.data.time !== undefined &&
                response.data.distance !== 'failed to measure, try again' &&
                response.data.time !== 'failed to measure, try again'
            ) {
                const distance = parseFloat(response.data.distance);
                const time = parseFloat(response.data.time);

                if (!isNaN(distance) && !isNaN(time) && time > 0) {
                    console.log('✅ Medición válida:', { distance, time });
                    return { distance, time };
                }
            }

            console.log('❌ Medición inválida. Reintentando...\n');
            // Pequeña pausa entre intentos
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error('Error en la solicitud:', error.message);
            if (attempt === maxAttempts) throw error;
        }
    }

    throw new Error('No se pudo obtener una medición válida después de varios intentos.');
}

async function sendSolution(speed) {
    try {
        // Usar "speed" como nombre de la clave según el swagger
        const payload = { speed };

        console.log(`🚀 Enviando solución con velocidad: ${speed} ua/h`);
        const response = await axios.post(`${baseURL}v1/s1/e1/solution`,
            payload,
            {
                headers: {
                    'API-KEY': token,
                    'Content-Type': 'application/json'
                },
            }
        );

        console.log('🎉 Respuesta de la API:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al enviar la solución:', error.message);
        if (error.response) {
            console.error('Detalles del error:', error.response.data);
        }
        throw error;
    }
}

async function main() {
    try {
        // Obtener una medición válida
        const { distance, time } = await getValidMeasurement();

        // Calcular la velocidad orbital y redondear al entero más cercano
        const speed = Math.round(distance / time);
        console.log(`📈 Velocidad orbital calculada: ${speed} ua/h`);

        // Enviar la solución
        await sendSolution(speed);
    } catch (error) {
        console.error('💥 Error en la misión:', error.message);
    }
}

// Ejecutar el programa
main();