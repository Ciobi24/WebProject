const { getUserById, updateUserByCredentials, getAllUsers, deleteUser} = require('../services/UserService');
const { getJwt } = require("../services/JwtService");
const querystring = require('querystring');

async function getUserByIdHandler(req, res) {

    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    try {
        const userId = decoded.id;

        console.log(userId);
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
async function getUserByIdnotCookieHandler(req, res) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('id');

    try {
        if (!userId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'User ID is required' }));
        }

        const user = await getUserById(userId);

        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error' }));
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

async function getAllUsersHandler(req, res)
{
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);

    if (!decoded || (decoded.role !== 'admin')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission!' }));
        return;
    }

    try {

        const useri = await getAllUsers();
        if (useri) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(useri));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Content not found!' }));
        }
    } catch (error) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized', error: error.message }));
    }
}

async function deleteUserByAdmin(req, res)
{
        const queryObject = new URL(req.url, `http://${req.headers.host}`).searchParams;
        const idUser = queryObject.get('id');
    
        const cookieHeader = req.headers.cookie;
        const decoded = getJwt(cookieHeader);
        const role = decoded.role;
            if (role !== 'admin') {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Unauthorized', error: 'User does not have permission' }));
                return;
            }
    
            try {
                const result = await deleteUser(idUser);
    
                if (result) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'User deleted successfully.' }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'User does not have permission or user to delete not found!' }));
                }
            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error deleting class.' }));
            }
}

module.exports = { getUserByIdHandler, updateUserByCredentialsHandler, getUserByIdnotCookieHandler, getAllUsersHandler, deleteUserByAdmin };
