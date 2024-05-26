const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const connect = require('./src/models/db-config.js');
const handleUserRoute = require('./routes.js');
const { deleteCookie } = require('./src/controllers/loginController.js');

connect();

const routes = {
    '/': (req, res) => {
        serveHTMLFile('/index.html', res);
    },
    '/user': (req, res) => {
        serveHTMLFile('/logged_page.html', res);
    },
    '/user/profil': (req, res) => {
        serveHTMLFile('/my_profile.html', res);
    },
    '/user/probleme': (req, res) => {
        serveHTMLFile('/probleme.html', res);
    },
    '/user/clasele-mele': (req, res) => {
        serveHTMLFile('/clasele_mele.html', res);
    },
    '/user/probleme-clasa-9': (req, res) => {
        serveHTMLFile('/probleme-clasa9.html', res);
    },
    '/user/probleme-clasa-10': (req, res) => {
        serveHTMLFile('/probleme-clasa10.html', res);
    },
    '/user/probleme-clasa-11': (req, res) => {
        serveHTMLFile('/probleme-clasa11.html', res);
    },
    '/user/clasele-mele/teme': (req, res) => {
        serveHTMLFile('/temele_mele.html', res);
    },
    '/reset-password' : (req, res) => {
        serveHTMLFile('/reset-password.html', res);
    },
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

    if (req.method == 'POST') {
        handleUserRoute(req, res);
    }
    else 
    { 
        if (routes[pathname]) 
        {
            routes[pathname](req, res);
        }
        else {
            serveStaticFile(pathname, res);
        }
    }
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
