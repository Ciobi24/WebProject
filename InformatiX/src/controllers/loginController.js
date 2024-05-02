const fs = require('fs');
const path = require('path');
const User = require('../models/userModel.js');

async function handleLogin(req, res) {
    let body = '';
    
    // Ascultă evenimentele pentru a citi datele trimise în corpul cererii
    req.on('data', chunk => {
        body += chunk.toString();
    });

    console.log(body);
    req.on('end', async () => {
        // Parsăm datele ca parametri URL-encoded
        const formData = new URLSearchParams(body);

        // Extragem username-ul și parola din datele formularului
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            // Începi logica de autentificare, de exemplu, verificând în baza de date
            const user = await User.findOne({ username });

            if (user && bcrypt.compareSync(password, user.password)) {
                // Autentificare reușită - redirect către pagina de dashboard
                res.writeHead(302, { 'Location': '/dashboard' });
                res.end();
            } else {
                // Autentificare eșuată - redirect către pagina de autentificare
                res.writeHead(302, { 'Location': '/user' });
                res.end();
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
        }
    });
}


module.exports = {
    handleLogin
};
