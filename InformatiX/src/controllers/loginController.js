const fs = require('fs');
const path = require('path');
const User = require('../models/userModel.js');
// const bcrypt = require('bcrypt');

async function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
 
        const formData = new URLSearchParams(body);
       
        const username = formData.get('email');
        const password = formData.get('password');

        console.log(username + " " + password);
        try {

            const user = await User.findOne({ username });
            if (user && bcrypt.compareSync(password, user.password)) {
         
                res.writeHead(302, { 'Location': '/user' });
                res.end();
            } else {
  
                res.writeHead(302, { 'Location': '/' });
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
