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
    
        try {
            const existingUserByEmail = await User.findOne({ email });
            const existingUserByUsername = await User.findOne({ username });
    
            if (existingUserByEmail || existingUserByUsername) {
                if (existingUserByEmail && existingUserByUsername) {
                    res.writeHead(409, { 'Content-Type': 'text/plain' });
                    res.end('Username-ul ' + username + ' deja există! Emailul ' + email + ' este deja utilizat!');
                } else if (existingUserByEmail) {
                    res.writeHead(409, { 'Content-Type': 'text/plain' });
                    res.end('Emailul ' + email + ' este deja utilizat!');
                } else {
                    res.writeHead(409, { 'Content-Type': 'text/plain' });
                    res.end('Username-ul ' + username + ' deja există!');
                }
            } else {
                const newUser = new User({ username, email, password, "birthday": null, "city" : ".", "firstname" : "." , "lastname": ".", "role" : "elev", "school": "." });
                await newUser.save();
    
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Contul a fost creat cu succes' }));
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Backend Error');
        }
    });
    
}

module.exports = {
    handleRegister
};
