const connect = require('../models/db-config');

async function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const formData = JSON.parse(body);
        const email = formData.email;
        const password = formData.password;

        const connection = await connect(); 

        try {
            const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
            connection.query(query, [email, password], (error, results, fields) => {
                if (error) {
                    console.error(error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Server Error');
                    return;
                }

                if (results.length > 0) {
                    res.end();
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Email sau parolă incorecte' }));
                }
            });
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
