
//const bcrypt = require('bcrypt');   // de implementat mai incolo
const User = require('../models/userModel.js');

async function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
 
        const formData = JSON.parse(body);
        const email = formData.email;
        const password = formData.password;
        
        try {
            const user = await User.findOne({ email });
            if (user && user.password === password) {
                res.end();
            } 
            else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Email sau parolă incorecte' }));
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
