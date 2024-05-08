const User = require('../models/userModel.js');
const fs = require('fs');
const path = require('path');

async function handleRegister(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const formData = JSON.parse(body);
        const username = formData.username;
        const email = formData.email;
        const password = formData.password;

        console.log(username);
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.writeHead(409, { 'Content-Type': 'text/plain' });
                res.end('Utilizatorul există deja');
            } else {
                const newUser = new User({ username, email, password, "birthday": null, "city" : ".", "firstname" : "." , "lastname": ".", "role" : "elev", "school": "." });
                await newUser.save();

    
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Contul a fost creat cu succes' }));
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
        }
    });
}

module.exports = {
    handleRegister
};
