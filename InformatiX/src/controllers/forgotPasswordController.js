const { findUserByEmail, updatePassword } = require('../services/UserService');
const { getEmailByResetToken, destroyResetToken, checkValabilyTokens, generateAndSaveToken} = require('../services/TokenResetService');
const { sendMailforResetPassword }= require('../services/SendMailService');
const os = require('os');

function getIPv4Address() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const addresses = networkInterfaces[interfaceName];
        for (const addressInfo of addresses) {
            if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
                return addressInfo.address;
            }
        }
    }
    return null;
}

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

                const ipv4Address = getIPv4Address(); // pentru a lua IP4Address, in functie de reteaua de Internet
                const resetLink = `http://${ipv4Address}:3001/reset-password?token=${resetToken}`; //serverul e localhost

                sendMailforResetPassword(email, userExists, resetLink);  // TRIMITE MAIL !!! E VALIDA SI FUNCTIONEAZA BINE

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

async function handleUpdatePassword(req, res)
{
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {

            const parsedBody = JSON.parse(body);
            const newPassword = parsedBody.newPassword;
            const resetToken = parsedBody.resetToken;

            console.log('The reset token is ' + resetToken + " and the password is " + newPassword);

            const email = await getEmailByResetToken(resetToken);

            const username = await updatePassword(newPassword, email);
            console.log('User ' + username +' changed the password successfully!')

            var isDestroyed = destroyResetToken(resetToken);
            if(isDestroyed)
                console.log("Reset token deleted successfully.");
            else
                console.log("Reset token not found."); // n-ar trebui sa intre niciodata in cazul asta, dar am adaugat sa fie si 'else'

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Password reset successfully!');
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid credentials!');
        }
    });
}

module.exports = {
    handleResetPassword,
    handleUpdatePassword
};
