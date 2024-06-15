const { findUserByEmailOrUsername, insertUser } = require('../services/UserService');


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
                await insertUser(username, email, password, 'elev');
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
