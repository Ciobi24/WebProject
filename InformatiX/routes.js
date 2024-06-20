const { handleLogin } = require('./src/controllers/AuthController');
const { handleRegister } = require('./src/controllers/RegisterController');
const { handleResetPassword } = require('./src/controllers/ForgotPasswordController');
const { handleUpdatePassword } = require('./src/controllers/ForgotPasswordController');
const { getUserByIdHandler, updateUserByCredentialsHandler,getUserByIdnotCookieHandler } = require('./src/controllers/UserController');
const { getProblemaById,addProblemaHandler, getProblemeByCategorie, getProblemeByClasa, getProblemaStats } = require('./src/controllers/ProblemeController');
const { getClassesByUser, createClass, getUsersByIdClass, addUserToClassController, deleteClassByIdController,deleteUserFromClassController} = require('./src/controllers/ClassesController');

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
    else if (req.url === '/api/allClasses' && req.method === 'GET') {
        getClassesByUser(req, res);
    }
    else if (req.url === '/api/createClass' && req.method === 'POST') {
        createClass(req, res);
    }
    else if (req.url.startsWith('/api/getEleviByIdClass?id=') && req.method === 'GET') {
        getUsersByIdClass(req, res);
    }
    else if (req.url.startsWith('/api/addUserToClass?id=') && req.method === 'POST') {
        addUserToClassController(req, res);
    }
    else if (req.url.startsWith('/api/deleteClass?id=') && req.method === 'DELETE') {
        deleteClassByIdController(req, res);
    } 
    else if (req.url.startsWith('/api/deleteUser?id=') && req.method === 'DELETE') {
        deleteUserFromClassController(req, res);
    } else if(req.url.match(/^\/api\/probleme\/\d+$/) && req.method === 'GET') {
        console.log(req.url);
        getProblemaById(req, res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Content not found!');
    } 
} 

module.exports = { handleUserRoute, handleApiRoute };
