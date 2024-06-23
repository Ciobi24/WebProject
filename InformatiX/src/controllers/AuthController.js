const jwt = require('jsonwebtoken');
const { findUserByEmailAndPassword, getUserById } = require('../services/UserService');
const bcrypt = require('bcrypt');

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

            const user = await findUserByEmailAndPassword(email, password);
            if (user) {
                const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '24h' });
                
                let redirectUrl = '/home'; 
                if (user.role === 'admin') {
                    redirectUrl = '/home/administrare';
                }

                res.writeHead(200, {
                    'Set-Cookie': `token=${token}; HttpOnly; Path=/; SameSite=Strict`,
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({ success: true, redirectUrl }));
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
