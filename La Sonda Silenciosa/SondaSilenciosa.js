const axios = require('axios');

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


function isValidMeasurement(data) {
    return (
        data &&
        typeof data.distance === 'number' &&
        typeof data.time === 'number' &&
        data.time > 0
    );
}


function calculateOrbitalVelocity(data) {
    const velocity = data.distance / data.time;
    return Math.round(velocity);
}


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


async function processPlanetaryData() {
    try {
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
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (!validMeasurement) {
            throw new Error('No se pudo obtener una lectura válida después de múltiples intentos.');
        }
        const orbitalVelocity = calculateOrbitalVelocity(validMeasurement);
        console.log(`Velocidad orbital calculada: ${orbitalVelocity} UA/hora`);
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

module.exports = {
    getMeasurement,
    isValidMeasurement,
    calculateOrbitalVelocity,
    sendSolution,
    processPlanetaryData
};