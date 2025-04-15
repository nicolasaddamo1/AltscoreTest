// planetary-scanner.js
const axios = require('axios');

/**
 * Obtiene la lectura del escáner de largo alcance
 * @returns {Promise<Object>} Los datos de la medición o error
 */
async function getMeasurement() {
    try {
        const response = await axios.get('/v1/s1/e1/resources/measurement');
        console.log('Datos recibidos del escáner:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la medición:', error.message);
        throw error;
    }
}

/**
 * Verifica si la lectura del escáner fue exitosa
 * @param {Object} data - Datos recibidos del escáner
 * @returns {Boolean} - Verdadero si la lectura contiene datos válidos
 */
function isValidMeasurement(data) {
    // Verificamos que existan los campos distance y time y que sean números
    return (
        data &&
        typeof data.distance === 'number' &&
        typeof data.time === 'number' &&
        data.time > 0 // El tiempo debe ser positivo para calcular la velocidad
    );
}

/**
 * Calcula la velocidad orbital instantánea en base a los datos del escáner
 * @param {Object} data - Datos de medición con distance y time
 * @returns {Number} - Velocidad orbital redondeada al entero más cercano
 */
function calculateOrbitalVelocity(data) {
    // Velocidad = distancia / tiempo
    const velocity = data.distance / data.time;
    // Redondear al entero más cercano
    return Math.round(velocity);
}

/**
 * Envía la velocidad orbital calculada a la API
 * @param {Number} velocity - La velocidad orbital calculada
 * @returns {Promise<Object>} - Respuesta de la API
 */
async function sendSolution(velocity) {
    try {
        const response = await axios.post('/v1/s1/e1/solution', { velocity });
        console.log('Respuesta al enviar la solución:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al enviar la solución:', error.message);
        throw error;
    }
}

/**
 * Función principal que maneja el proceso completo
 * @returns {Promise<Object>} - Resultado final del proceso
 */
async function processPlanetaryData() {
    try {
        // Intentar obtener una lectura válida a pesar de la interferencia cósmica
        let validMeasurement = null;
        let attempts = 0;
        const MAX_ATTEMPTS = 5;

        while (!validMeasurement && attempts < MAX_ATTEMPTS) {
            attempts++;
            console.log(`Intento ${attempts} de obtener una lectura válida...`);

            const measurementData = await getMeasurement();

            if (isValidMeasurement(measurementData)) {
                validMeasurement = measurementData;
                console.log('¡Lectura válida obtenida!');
            } else {
                console.log('Lectura no válida. Interferencia cósmica detectada.');
                // Pequeña pausa antes del siguiente intento
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (!validMeasurement) {
            throw new Error('No se pudo obtener una lectura válida después de múltiples intentos.');
        }

        // Calcular la velocidad orbital
        const orbitalVelocity = calculateOrbitalVelocity(validMeasurement);
        console.log(`Velocidad orbital calculada: ${orbitalVelocity} UA/hora`);

        // Enviar la solución
        const result = await sendSolution(orbitalVelocity);

        return {
            success: true,
            orbitalVelocity,
            response: result
        };
    } catch (error) {
        console.error('Error en el proceso de análisis planetario:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Exportar las funciones para usarlas en otros archivos
module.exports = {
    getMeasurement,
    isValidMeasurement,
    calculateOrbitalVelocity,
    sendSolution,
    processPlanetaryData
};