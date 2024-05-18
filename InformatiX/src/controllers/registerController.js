const connect = require('../models/db-config');

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

        const connection = await connect(); 
        try {

            const verifExist = `SELECT * FROM users WHERE email = ? OR username = ?`;
            connection.query(verifExist, [email, username], (error, results, fields) => {
                if (error) {
                    console.error(error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Server Error');
                    return;
                }

                if (results.length > 0) {
                    const existingUser = results[0];
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

                    const insertQuery = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
                    connection.query(insertQuery, [username, email, password, 'elev'], (error, results, fields) => {
                        if (error) {
                            console.error(error);
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Server Error');
                            return;
                        }

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, message: 'Contul a fost creat cu succes' }));
                    });
                }
            });

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
