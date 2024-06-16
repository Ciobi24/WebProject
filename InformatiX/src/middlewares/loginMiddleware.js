const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

function verifyToken(req, res, next) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
    }

    const cookies = cookieHeader.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies[name] = value;
        return cookies;
    }, {});

    const token = cookies.token;
    if (!token) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
        return;
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
            return;
        }

        req.user = decoded; 
        next();
    });
}

module.exports = {
    verifyToken,
};
