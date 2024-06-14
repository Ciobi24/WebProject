const mail = require('../services/emailService');
const generateAndSaveToken = require('../services/manageResetToken')
const { checkValabilyTokens } = require('../models/tokenModel');
const { findUserByEmail } = require('../models/userModel');

async function handleResetPassword(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            await checkValabilyTokens();
            
            const parsedBody = JSON.parse(body);
            const email = parsedBody.email;

            const userExists = await findUserByEmail(email);

            if (userExists) {
                var currentDate = new Date();
                currentDate.setHours(currentDate.getHours() + 3); // pt a ajunge la ora Romaniei, serverul ruleaza la noi!

                currentDate.setDate(currentDate.getDate() + 1);
                var dateTime = currentDate.toISOString().slice(0, 19).replace('T', ' ');
                var resetToken = await generateAndSaveToken(email, dateTime);

                const resetLink = `http://192.168.1.2:3001/reset-password?token=${resetToken}`; //serverul e localhost

                // FOARTE IMPORTANT ESTE 192.168.1.2:3001  - PT A RULA LOCAL
                // difera de la un PC la altul
                //mail.sendMailforResetPassword(email, userExists, resetLink);  // TRIMITE MAIL !!! E VALIDA SI FUNCTIONEAZA BINE

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

async function getDateResetPassword()
{

}

module.exports = {
    handleResetPassword,
    getDateResetPassword
};
