const jwt = require('jsonwebtoken');
const { findUserByEmailAndPassword } = require('../services/UserService');

require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

async function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const formData = JSON.parse(body);
        const email = formData.email;
        const password = formData.password;

        try {
            if (!secretKey) {
                throw new Error('Secret key is missing or not set');
            }

            const results = await findUserByEmailAndPassword(email, password);
            if (results.length > 0) {
                const user = results[0];
                const token = jwt.sign({ id: user.id, email: user.email }, secretKey);

                res.writeHead(200, {
                    'Set-Cookie': `token=${token}; HttpOnly; Path=/; SameSite=Strict`, // Cookie de sesiune
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({ success: true }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Email sau parolă incorecte' }));
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
        }
    });
}

module.exports = {
    handleLogin,
};
