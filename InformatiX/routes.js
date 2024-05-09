
const { handleLogin } = require('./src/controllers/loginController.js');
const { handleRegister } = require('./src/controllers/registerController.js');

function handleUserRoute(req, res) {
    if (req.url === '/user') {
        handleLogin(req, res);
    } else if (req.url === '/register') {
        handleRegister(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
}


module.exports = handleUserRoute;
