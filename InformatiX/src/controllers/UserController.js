const { getUserById, updateUserByCredentials } = require('../services/UserService');
const { getJwt } = require("../services/JwtService");
const querystring = require('querystring');

async function getUserByIdHandler(req, res) {

    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    try {
        const userId = decoded.id;

        const user = await getUserById(userId);
        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
        }
    } catch (error) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: error.message }));
    }
}

async function updateUserByCredentialsHandler(req, res) {
    try {
        const cookieHeader = req.headers.cookie;
        const decoded = getJwt(cookieHeader);
        
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {

            const user = await updateUserByCredentials(decoded, JSON.parse(body));

            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'User updated successfully', user }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'User not found' }));
            }
        });

    } catch (error) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized', error: error.message }));
    }
}

module.exports = { getUserByIdHandler, updateUserByCredentialsHandler };
