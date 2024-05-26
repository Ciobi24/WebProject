const userModel = require('../models/userModel');
const mail = require('../services/emailService');

async function handleResetPassword(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const parsedBody = JSON.parse(body);
            const email = parsedBody.email;

            var userExists = await userModel.findUserByEmail(email);

            if (userExists != null) {
                mail.sendMailforResetPassword(email, userExists, 'link-resetare-parola'); // apel serviciu pt trimitere mail la emailul specific

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Password reset link sent');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Email not found');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid JSON');
        }
    });
}

module.exports = {
    handleResetPassword
};
