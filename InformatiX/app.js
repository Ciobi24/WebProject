const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const { MongoClient } = require("mongodb");
const { default: mongoose } = require('mongoose');

const uri = "mongodb+srv://infoX:tehnologii-web2024@informatixdb.hw325xp.mongodb.net/?retryWrites=true&w=majority&appName=informatixDB";
async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to DB.");
    } catch (error) {
        console.error("Error connecting to DB: " + error);
    }

    const db = mongoose.connection;
    const userSchema = new mongoose.Schema({
        nume: String,
        prenume: String
    });

    const User = mongoose.model('User', userSchema);
    const users = await User.find();

    console.log("Users:", users); // an example of SELECT
}
connect();

const server = http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let pathname = q.pathname;

    let index = pathname.indexOf('?');  // asta va trebui scos mai apoi dupa ce se face logarea !!
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
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
