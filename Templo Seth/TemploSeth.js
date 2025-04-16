const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const ROLLODEX_ENDPOINT = `${BASE_URL}${process.env.ROLLODEX_ENDPOINT}`;
const HEADERS = {
    'API-KEY': API_KEY,
    'Accept': 'application/json',
};

async function getRolodex() {
    try {
        const name = 'Luke Skywalker';
        const response = await axios.get(`${ROLLODEX_ENDPOINT}?name=${encodeURIComponent(name)}`, {
            headers: HEADERS,
        });
        console.log('🧙‍♂️ Rolodex obtenido:', response.data);

        const atob = (str) => Buffer.from(str, 'base64').toString('utf-8');
        const encoded = process.env.ENCODED;
        console.log(atob(encoded));
        return response.data;
    } catch (err) {
        console.error('❌ Error al obtener el rolodex:', err.message);
        if (err.response) {
            console.error(err.response.status, err.response.data);
        }
    }
}




getRolodex();
