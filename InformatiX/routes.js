const { handleLogin,handleLogout } = require('./src/controllers/AuthController');
const { handleRegister } = require('./src/controllers/RegisterController');
const { handleResetPassword } = require('./src/controllers/ForgotPasswordController');
const { handleUpdatePassword } = require('./src/controllers/ForgotPasswordController');
const {deleteUserByAdmin, getUserByIdHandler, updateUserByCredentialsHandler, getUserByIdnotCookieHandler, getAllUsersHandler } = require('./src/controllers/UserController');
const { fetchGrade,handleProfessorGradeSubmission, handleProfessorCommentSubmission, getSolutionByUserAndProblemEvaluate, getProblemsByTema, deleteComment, handleCommentSubmission, fetchCommentsHandler, getSolutionByUserAndProblem, submitSolution, getDeadlineByTema, setProblemaRating, getProblemaById, addProblemaHandler,
    getProblemeByCategorie, getProblemeByClasa, getProblemaStats, getProblemsUnverified, aprobareProblema, respingereProblema } = require('./src/controllers/ProblemeController');
const { getClassesByUser, createClass, getUsersByIdClass, addUserToClassController, deleteClassByIdController, deleteUserFromClassController } = require('./src/controllers/ClassesController');
const { createTema, getTeme, getProblemsByIdTema, addProblemToTema } = require('./src/controllers/TemeController');

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
    }else if(req.url === '/logout') {
        handleLogout(req, res);
    }
    else {
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
    } else if (req.url.startsWith('/api/problemeByCategorie') && req.method === 'GET') {
        getProblemeByCategorie(req, res);
    }
    else if (req.url.startsWith('/api/problemeByClasa') && req.method === 'GET') {
        getProblemeByClasa(req, res);
    }
    else if (req.url.startsWith('/api/getAllProblemsUnverified') && req.method === 'GET') {
        getProblemsUnverified(req, res);
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
    }
    else if (req.url.match(/^\/api\/probleme\/\d+$/) && req.method === 'GET') {
    } 
    else if (req.url.startsWith('/api/deleteUserAdmin?id=') && req.method === 'DELETE') {
        deleteUserByAdmin(req, res);
    } 
    else if(req.url.match(/^\/api\/probleme\/\d+$/) && req.method === 'GET') { 
        getProblemaById(req, res);
    } else if (req.url.match(/^\/api\/probleme\/\d+\/rating$/) && req.method === 'PUT') {
        setProblemaRating(req, res);
    } else if (req.url.startsWith('/api/teme/') && req.url.endsWith('/deadline') && req.method === 'GET') {
        getDeadlineByTema(req, res);
    } else if (req.url === '/api/submitSolution' && req.method === 'PUT') {
        submitSolution(req, res);
    } else if (req.url.startsWith('/api/getSolution/evaluare') && req.method === 'GET') {
        getSolutionByUserAndProblemEvaluate(req, res);
    }
    else if (req.url.startsWith('/api/getSolution') && req.method === 'GET') {
        getSolutionByUserAndProblem(req, res);
    }
    else if (req.url === '/api/createTema' && req.method === 'POST') {
        createTema(req, res);
    }
    else if (req.url.startsWith('/api/getTeme?id=') && req.method === 'GET') {
        getTeme(req, res);
    }
    else if (req.url.startsWith('/api/getProblemsByIdTema?id=') && req.method === 'GET') {
        getProblemsByIdTema(req, res);
    }
    else if (req.url.startsWith('/api/addProblem?id=') && req.method === 'POST') {
        addProblemToTema(req, res);
    }
    else if (req.url.startsWith('/api/checkSuccesProblem?id=') && req.method === 'PATCH') {
        aprobareProblema(req, res);
    }
    else if (req.url.startsWith('/api/checkFailProblem?id=') && req.method === 'DELETE') {
        respingereProblema(req, res);
    }
    else if (req.url === '/api/getAllUsers' && req.method === 'GET') {
        getAllUsersHandler(req, res);
    }
    else if (req.url.startsWith('/api/comments/professor') && req.method === 'PUT') {
        handleProfessorCommentSubmission(req, res);
    }
    else if (req.url.startsWith('/api/comments') && req.method === 'GET') {
        fetchCommentsHandler(req, res);
    }
    else if (req.url.startsWith('/api/comments') && req.method === 'PUT') { handleCommentSubmission(req, res); }
    else if (req.url.startsWith('/api/comments') && req.method === 'DELETE') { deleteComment(req, res); }
    else if (req.url.startsWith('/api/problems') && req.method === 'GET') {
        getProblemsByTema(req, res);
    } else if (req.url.startsWith('/api/grades/professor') && req.method === 'PUT') {
        handleProfessorGradeSubmission(req, res);
    }else if (req.url.startsWith('/api/grades') && req.method === 'GET') {
        fetchGrade(req, res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Content not found!');
    }
}

module.exports = { handleUserRoute, handleApiRoute };

