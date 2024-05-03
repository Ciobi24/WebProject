// routes/userRoutes.js
const { handleLogin } = require('./src/controllers/loginController.js');

function handleUserRoute(req, res) {
    if (req.method === 'POST' && req.url === '/user') {
        handleLogin(req, res);
    } else {

    }
}

module.exports = handleUserRoute;
