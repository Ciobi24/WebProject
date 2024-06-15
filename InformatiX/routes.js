
const { handleLogin } = require('./src/controllers/AuthController');
const { handleRegister } = require('./src/controllers/RegisterController');
const { handleResetPassword } = require('./src/controllers/ForgotPasswordController');
const { handleUpdatePassword } = require ('./src/controllers/ForgotPasswordController');

function handleUserRoute(req, res) {
    if (req.url === '/home') {
        handleLogin(req, res);
    } else if (req.url === '/register') {
        handleRegister(req, res);
    }
    else if (req.url == '/reset-password') {
        handleResetPassword(req, res); //acest serviciu trimite mailul si valideaza existenta mailului in DB
    } else if (req.url == '/getDateResetPassword') {
        handleUpdatePassword(req, res); // acest serviciu este responsabil cu actualizarea parolei din baza de date
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
}


module.exports = handleUserRoute;
