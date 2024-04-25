const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let pathname = q.pathname;

    let index = pathname.indexOf('?');
    if (index !== -1) {
        pathname = pathname.substring(0, index);
    }
    if (!pathname || pathname === '/') {
        pathname = '/index.html'; 
    }

    let filename;
    let extname = path.extname(pathname);

    let contentType = 'text/html';
    switch (extname) {
        case '.html':
            filename = './src/views' + pathname; 
            contentType = 'text/html';
            break;
        case '.css':
            filename = './public/css' + pathname; 
            contentType = 'text/css'; 
            break;
        default:
            filename = './src/views' + pathname;
            break;
    }

    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("Page not found");
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        res.end();
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
