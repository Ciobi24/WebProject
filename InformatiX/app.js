const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const { MongoClient } = require("mongodb");
const { default: mongoose } = require('mongoose');
const { handleLogin } = require('./src/controllers/loginController.js');

const uri = "mongodb+srv://infoX:tehnologii-web2024@informatixdb.hw325xp.mongodb.net/?retryWrites=true&w=majority&appName=informatixDB";
async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to DB.");
    } catch (error) {
        console.error("Error connecting to DB: " + error);
    }

    const db = mongoose.connection;
}
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
    if (req.method === 'POST' && pathname === '/user') {
        handleLogin(req, res); 
    }
    else if (routes[pathname]) 
    {
        routes[pathname](req, res); 
    } 
    else 
    {
        serveStaticFile(pathname, res);
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

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
