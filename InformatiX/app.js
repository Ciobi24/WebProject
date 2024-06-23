const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const dbInstance = require('./src/models/db-config.js');
const { handleUserRoute, handleApiRoute } = require('./routes');
const { checkTokenExistence } = require('./src/services/TokenResetService.js');
const { verifyToken } = require('./src/middlewares/loginMiddleware.js');
const { getJwt } = require("./src/services/JwtService.js");
const { applyToTeacherController, getAllApplicationsController, respingereApplicationController , aprobareApplicationController } = require('./src/controllers/ApplyToTeacherController.js');

require('dotenv').config();
dbInstance.connect();

const routes = {
    '/': (req, res) => {
        serveHTMLFile('/index.html', res);
    },
    '/home': (req, res) => {
        serveHTMLFile('/logged_page.html', res);
    },
    '/home/profil': (req, res) => {
        serveHTMLFile('/my_profile.html', res);
    },
    '/home/probleme': (req, res) => {
        serveHTMLFile('/probleme.html', res);
    },
    '/home/clasele-mele': (req, res) => {
        serveHTMLFile('/clasele_mele.html', res);
    },
    '/home/probleme-clasa-9': (req, res) => {
        serveHTMLFile('/probleme-clasa9.html', res);
    },
    '/home/probleme-clasa-10': (req, res) => {
        serveHTMLFile('/probleme-clasa10.html', res);
    },
    '/home/probleme-clasa-11': (req, res) => {
        serveHTMLFile('/probleme-clasa11.html', res);
    },
    '/home/clasele-mele/teme': (req, res) => {
        serveHTMLFile('/temele_mele.html', res);
    },
    '/home/clasele-mele/teme/rezolvare': (req, res) => {
        serveHTMLFile('/solution.html', res);
    },
    '/home/administrare': (req, res) => {
        if (checkAdminRole(req, res)) {
            serveHTMLFile('/administrare.html', res);
        } else {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Unauthorized');
        }
    },
    '/home/probleme-clasa-9/probleme-elementare': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-9/elemente-ale-limbajului': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-9/tablouri-unidimensionale': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-9/tablouri-bidimensionale': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-9/probleme-diverse': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-10/subprograme': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-10/recursivitate': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-10/divide-et-impera': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-10/siruri-de-caractere': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-10/structuri-de-date-liniare': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-10/liste-alocate-dinamic': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-10/tipul-struct': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-11/teoria-grafurilor': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-11/programare-dinamica': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-11/metoda-greedy': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-11/backtracking': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-11/programare-orientata-pe-obiecte': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/probleme-clasa-11/arbori': (req, res) => {
        serveHTMLFile('/lista_pb.html', res);
    },
    '/home/clasele-mele/teme/:idTema/rezolva-pb/:idProblema': (req, res) => {
        serveHTMLFile('/rezolva_pb.html', res);
    },
    '/home/clasele-mele/teme/:idTema/evalueaza/:idElev': (req, res) => {
        serveHTMLFile('/solution.html', res);
    },  
    '/reset-password': async (req, res) => {
        const urlString = req.url;
        const parameter = url.parse(urlString, true).query;
        const token = parameter.token;

        try {
            const email = await checkTokenExistence(token);
            if (email) {
                serveHTMLFile('/reset-password.html', res);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("Token not found");
            }
        } catch (error) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("Internal server error!" + error);
        }
    }
};

function serveHTMLFile(filePath, res) {
    fs.readFile('./src/views' + filePath, (err, data) => {
        if (err) {
            console.error("Wrong path: ", filePath);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("Page not found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
}

const server = http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let pathname = q.pathname;

    if (pathname === '/') {
        routes['/'](req, res);
        return;
    }
    if (pathname === '/reset-password' && req.method == 'GET') {
        routes['/reset-password'](req, res);
        return;
    }
    if (pathname === '/reset-password' && req.method == 'POST') {
        handleUserRoute(req, res);
        return;
    }
    if(pathname === '/applyToTeacher')
    {
        applyToTeacherController(req,res);
        return;
    }
    if(pathname === '/getAllApplications')
    {
        getAllApplicationsController(req,res);
        return;
    }
    if(pathname.startsWith('/applyToTeacherRespingere/'))
    {
        respingereApplicationController(req,res);
        return;
    }
    if(pathname.startsWith('/applyToTeacherAprobare/'))
    {
        aprobareApplicationController(req,res);
        return;
    }

    if (pathname.startsWith('/api/')) {
        verifyToken(req, res, () => {
            handleApiRoute(req, res); // aici cumva fac cererile doar catre baza de date sa-mi dea informatii, n-am treaba cu paginile
        });
        return;
    }

    if (req.method === 'POST') {
        handleUserRoute(req, res);
        return;
    }

    const regex = /\/home\/clasele-mele\/teme\/[^/]+\/rezolva-pb\/[^/]+/;
    if (regex.test(pathname)) {
        verifyToken(req, res, () => {
            verifyStudentAccess(req, res, () => routes['/home/clasele-mele/teme/:idTema/rezolva-pb/:idProblema'](req, res));
        });
        return;
    }
    const regex2 = /\/home\/clasele-mele\/teme\/\d+\/evalueaza\/\d+/;
    if (regex2.test(pathname)) {
        verifyToken(req, res, () => {
            verifyProfessorAccess(req, res, () => routes['/home/clasele-mele/teme/:idTema/evalueaza/:idElev'](req, res));
        });
        return;
    }

    if (pathname.startsWith('/uploads/')) {
        const idUser = pathname.split('/')[2]; 
        if (!isNaN(idUser)) {
            serveHTMLFile('/upload.html', res);
        }
        return;
    }

    if(pathname.startsWith('/home/clasele-mele/teme/'))
        {
            serveHTMLFile('/temele_mele.html', res);
            return;
        }


    if (routes[pathname]) {
        verifyToken(req, res, () => routes[pathname](req, res));
        return;
    }

    serveStaticFile(pathname, res);
});

function serveStaticFile(pathname, res) {
    let filename;
    let extname = path.extname(pathname);
    let contentType = '';
    switch (extname) {
        case '.css':
            filename = '.' + pathname;
            contentType = 'text/css';
            break;
        case '.js':
            filename = '.' + pathname;
            contentType = 'application/javascript';
            break;
        case '.jpg':
        case '.jpeg':
        case '.png':
        case '.gif':
            filename = '.' + pathname;
            contentType = 'image/' + extname.substring(1);
            break;
        case '.ttf':
            filename = '.' + pathname;
            contentType = 'font/ttf';
            break;
        default:
            filename = '.' + pathname;
            contentType = 'application/octet-stream'; // Default MIME type
            break;
    }

    fs.readFile(filename, (err, data) => {
        if (err) {
            if(!filename.startsWith("./public/uploads"))
              console.error("Wrong path: ", filename);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("Page not found");
        }
        else
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        res.end();
    });
}

server.listen(3001, () => {
    console.log("Server running on port 3001");
});

function checkAdminRole(req, res, next) {
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    if (decoded.role !== 'admin') {
        return false;
    }
    return true;
}
async function verifyStudentAccess(req, res, next) {
    const urlParts = req.url.split('/');
    const idTema = parseInt(urlParts[4], 10);
    const idProblema = parseInt(urlParts[6], 10);
    
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    const idUser = parseInt(decoded.id, 10);

    try {
        const connection = await dbInstance.connect();
        
        const [temaResult] = await connection.query('SELECT id_clasa FROM teme WHERE id = ?', [idTema]);
        if (temaResult.length === 0) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Tema not found');
            return;
        }
        const idClasa = temaResult[0].id_clasa;
        if(!idClasa || (Number.isNaN(idClasa)))
        {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad request!');
            return;
        }

        const [classResult] = await connection.query('SELECT * FROM clase_elevi WHERE id_clasa = ? AND id_user = ?', [idClasa, idUser]);
        if (classResult.length === 0) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Access forbidden');
            return;
        }
        const [problemeTemaResult] = await connection.query('SELECT * FROM probleme_teme WHERE id_tema = ? AND id_problema = ?', [idTema, idProblema]);
        if (problemeTemaResult.length === 0) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Problema does not belong to the tema');
            return;
        }
        next();
    } catch (error) { 
        console.error('Error verifying student access:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
    }
}

async function verifyProfessorAccess(req, res, next) {
    const urlParts = req.url.split('/');
    const idTema = parseInt(urlParts[4], 10);
    const idElev = parseInt(urlParts[6], 10);
    
    const cookieHeader = req.headers.cookie;
    const decoded = getJwt(cookieHeader);
    const idUser = parseInt(decoded.id, 10);

    try {
        const connection = await dbInstance.connect();
        
        const [temaResult] = await connection.query('SELECT id_clasa FROM teme t JOIN clase c ON t.id_clasa = c.id WHERE t.id = ? AND c.id_user = ?', [idTema, idUser]);
        if (temaResult.length === 0) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Tema not found');
            return;
        }
        const idClasa = temaResult[0].id_clasa;

        const [classResult] = await connection.query('SELECT * FROM clase_elevi WHERE id_clasa = ? AND id_user = ?', [idClasa, idElev]);
        if (classResult.length === 0) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Access forbidden');
            return;
        }
        next();
    } catch (error) {
        console.error('Error verifying professor access:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
    }
}