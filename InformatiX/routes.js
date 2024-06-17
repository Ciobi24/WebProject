const { handleLogin } = require('./src/controllers/AuthController');
const { handleRegister } = require('./src/controllers/RegisterController');
const { handleResetPassword } = require('./src/controllers/ForgotPasswordController');
const { handleUpdatePassword } = require('./src/controllers/ForgotPasswordController');
const { getUserByIdHandler, updateUserByCredentialsHandler } = require('./src/controllers/UserController');
const { addProblemaHandler } = require('./src/controllers/ProblemeController');

function handleUserRoute(req, res) {
    if (req.url === '/home') {
        handleLogin(req, res);
    } else if (req.url === '/register') {
        handleRegister(req, res);
    }
    else if (req.url == '/reset-password') {
        handleResetPassword(req, res); 
    } else if (req.url == '/getDateResetPassword') {
        handleUpdatePassword(req, res); 
    } else if (req.url === '/addProblema' && req.method === 'POST') {
        addProblemaHandler(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
}

function handleApiRoute(req, res) {
    if (req.url === '/api/user') {
        getUserByIdHandler(req, res);
    }
    else if (req.url === '/api/updateUser') {
        updateUserByCredentialsHandler(req, res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Content not found!');
    }
}

module.exports = { handleUserRoute, handleApiRoute };
