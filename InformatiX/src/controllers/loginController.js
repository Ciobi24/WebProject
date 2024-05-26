const connect = require('../models/db-config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(64).toString('hex');
var token;

async function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const formData = JSON.parse(body);
        const email = formData.email;
        const password = formData.password;

        const connection = await connect(); 

        try {
            const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
            connection.query(query, [email, password], (error, results, fields) => {
                if (error) {
                    console.error(error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Server Error');
                    return;
                }

                if (results.length > 0) {
                    const user = results[0];
                    token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '6h' });

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, token }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Email sau parolă incorecte' }));
                }
            });
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
        }
    });
}

function deleteCookie(req, res) {
    res.writeHead(200, {
        'Set-Cookie': 'token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ success: true, message: 'Cookie deleted' }));
}

module.exports = {
    handleLogin,
    deleteCookie
};