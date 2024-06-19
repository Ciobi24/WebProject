const { handleLogin } = require('./src/controllers/AuthController');
const { handleRegister } = require('./src/controllers/RegisterController');
const { handleResetPassword } = require('./src/controllers/ForgotPasswordController');
const { handleUpdatePassword } = require('./src/controllers/ForgotPasswordController');
const { getUserByIdHandler, updateUserByCredentialsHandler,getUserByIdnotCookieHandler } = require('./src/controllers/UserController');
const { addProblemaHandler, getProblemeByCategorie, getProblemeByClasa, getProblemaStats } = require('./src/controllers/ProblemeController');

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
    if (req.url.startsWith('/api/user?id=') && req.method === 'GET') {
        getUserByIdnotCookieHandler(req, res);
    }
    else if (req.url === '/api/user') {
        getUserByIdHandler(req, res);
    } 
    else if (req.url === '/api/updateUser') {
        updateUserByCredentialsHandler(req, res);
    }else if (req.url.startsWith('/api/problemeByCategorie') && req.method === 'GET') {
        getProblemeByCategorie(req, res);
    }
    else if (req.url.startsWith('/api/problemeByClasa') && req.method === 'GET') {
        getProblemeByClasa(req, res);
    }
    else if (req.url.startsWith('/api/problemaStats') && req.method === 'GET') {
        getProblemaStats(req, res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Content not found!');
    }
}

module.exports = { handleUserRoute, handleApiRoute };
