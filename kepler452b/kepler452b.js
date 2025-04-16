require('dotenv').config();
const axios = require('axios');

const baseURL = process.env.BASE_URL;
const token = process.env.API_KEY;

async function getStars() {
        await axios.get(`${baseURL}v1/s1/e2/resources/stars`, {
            headers: {
                'API-KEY': token,
            }
        }).then(response => {
        console.log(response)
        console.log(response.headers); // Esto te da los headers de la respuesta
    })
    .catch(error => console.error(error));
}
getStars()