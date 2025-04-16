require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

const SOLUTION_ENDPOINT = `${BASE_URL}/solution`;

const HEADERS = {
    'API-KEY': API_KEY,
    'Content-Type': 'application/json',
};

function caesarShift(text, shift = 3) {
    return text.split('').map(char => {
        if (!char.match(/[a-zA-Z]/)) return char;
        const base = char === char.toUpperCase() ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
    }).join('');
}

const usernames = [
    'Not all those who wander are lost',
    'Not all those who wander',
    'NotAllThoseWhoWanderAreLost',
    'TheKeeperOfSecrets',
    'The Keeper of Secrets',
    'ElvenLore',
    'elvenlore',
    'LightBearer',
    'Galadriel',
    'Celebrimbor',
    'TheLight',
    caesarShift('Not all those who wander are lost', 3),
];

const passwordsPlain = [
    'are lost',
    'ARE LOST',
    'ARE_LOST',
    'duh orvw',
    'duhorvw',
    caesarShift('are lost', 3),
    caesarShift('light', 3),
    'LightBearer',
    'ShadowKey',
    'ForgeKey',
];

(async () => {
    for (const username of usernames) {
        for (const password of passwordsPlain) {
            const payload = { username, password };
            console.log(`🔐 Probando:`, payload);
            try {
                const res = await axios.post(SOLUTION_ENDPOINT, payload, { headers: HEADERS });
                if (res.data.result === 'correct') {
                    console.log('✅ ¡ENCONTRADO!');
                    console.log('👉 Usuario:', username);
                    console.log('👉 Contraseña:', password);
                    return;
                }
            } catch (err) {
                const code = err.response?.status || '???';
                const detail = err.response?.data || err.message;
                console.log(`❌ (${code}) ${JSON.stringify(detail)}`);
            }
        }
    }

    console.log('🔎 Terminamos. Ninguna combinación fue correcta.');
})();
