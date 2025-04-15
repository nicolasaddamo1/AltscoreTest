const axios = require('axios');

const data = {
    "alias": "niqoobmx",
    "country": "ARG", // Cambiado de "Argentina" a "ARG"
    "email": "nicolasaddamo1@gmail.com",
    "apply_role": "engineering"
}

async function register(data) {
    try {
        const baseURL = 'https://makers-challenge.altscore.ai/';
        const response = await axios.post(`${baseURL}/v1/register`, data);
        console.log('Respuesta al enviar la solución:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al enviar la solución:', error.message);
        console.error('Detalles del error:', error.response?.data || error);
        throw error;
    }
}

register(data)
    .then(result => console.log('Registro exitoso:', result))
    .catch(err => console.log('Falló el registro'));