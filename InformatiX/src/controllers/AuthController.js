const jwt = require('jsonwebtoken');
const { findUserByEmailAndPassword, getUserById } = require('../services/UserService');
const { getUserByIdHandler } = require('./UserController');

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
                console.log(user);
                const token = jwt.sign({ id: user.id, role: user.role}, secretKey);
                const userDetails = await getUserById(user.id);

                let redirectUrl = '/home'; // default redirect URL
                // console.log(userDetails.role);
                if (userDetails.role === 'admin') {
                    redirectUrl = '/home/administrare'; // admin redirect URL
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
