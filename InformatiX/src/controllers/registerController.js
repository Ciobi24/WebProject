const { findUserByEmailOrUsername, insertUser } = require('../services/UserService');
const bcrypt = require('bcrypt');

// Functia de validare a emailului
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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

        // Validare email
        if (!isValidEmail(email)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Email invalid');
        }

        try {
            const existingUsers = await findUserByEmailOrUsername(email, username);

            if (existingUsers.length > 0) {
                const existingUser = existingUsers[0];
                if (existingUser.email === email && existingUser.username === username) {
                    res.writeHead(409, { 'Content-Type': 'text/plain' });
                    res.end(`Username-ul ${username} și emailul ${email} sunt deja utilizate!`);
                } else if (existingUser.email === email) {
                    res.writeHead(409, { 'Content-Type': 'text/plain' });
                    res.end(`Emailul ${email} este deja utilizat!`);
                } else {
                    res.writeHead(409, { 'Content-Type': 'text/plain' });
                    res.end(`Username-ul ${username} este deja utilizat!`);
                }
            } else {
                const iteratii = 10;
                const hashedPassword = await bcrypt.hash(password, iteratii);

                await insertUser(username, email, hashedPassword, 'elev');
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
