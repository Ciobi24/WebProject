const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const dbInstance = require('./src/models/db-config.js');
const { handleUserRoute, handleApiRoute } = require('./routes');
const { checkTokenExistence } = require('./src/services/TokenResetService.js');
const { verifyToken } = require('./src/middlewares/loginMiddleware.js');

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
    '/home/administrare': (req, res) => {
        serveHTMLFile('/administrare.html', res);
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

    if (req.method === 'POST') {
        handleUserRoute(req, res);
        return;
    }

    if (pathname === '/') {
        routes['/'](req, res);
        return;
    }

    if (pathname === '/reset-password') {
        routes['/reset-password'](req, res);
        return;
    }

    if (pathname.startsWith('/api/')) {
        verifyToken(req, res, () => {
            handleApiRoute(req, res); // aici cumva fac cererile doar catre baza de date sa-mi dea informatii, n-am treaba cu paginile
        });
        return;
    }

    if (routes[pathname]) {
        verifyToken(req, res, () => routes[pathname](req, res));
        return;
    }

    serveStaticFile(pathname, res);
});

// function serveStaticFile(filePath, res) {
//     const extname = path.extname(filePath);
//     const contentType = {
//         '.html': 'text/html',
//         '.js': 'text/javascript',
//         '.css': 'text/css',
//         '.png': 'image/png',
//         '.jpg': 'image/jpeg',
//     }[extname] || 'application/octet-stream';

//     fs.readFile(path.join(__dirname, 'public', filePath), (err, data) => {
//         if (err) {
//             res.writeHead(404, { 'Content-Type': 'text/plain' });
//             res.end('Not Found');
//             return;
//         }

//         res.writeHead(200, { 'Content-Type': contentType });
//         res.end(data);
//     });
// }

function serveStaticFile(pathname, res) {
    let filename;
    let extname = path.extname(pathname);
    let contentType = '';
    switch (extname) {
        case '.css':
            filename = '.' + pathname;
            contentType = 'text/css';
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
            break;
    }

    fs.readFile(filename, (err, data) => {
        if (err) {
            console.error("Wrong path: ", filename);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("Page not found");
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        res.end();
    });
}

server.listen(3001, () => {
    console.log("Server running on port 3001");
});