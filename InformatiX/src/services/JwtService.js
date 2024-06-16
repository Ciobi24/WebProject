const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

function getJwt(cookieHeader) {
    if (!cookieHeader) {
        return { success: false, message: 'Unauthorized: No cookies found in headers' };
    }

    if (typeof cookieHeader !== 'string') {
        return { success: false, message: 'Unauthorized: Invalid cookie header format' };
    }

    const cookies = cookieHeader.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies[name] = value;
        return cookies;
    }, {});

    const token = cookies.token;
    if (!token) {
        return { success: false, message: 'Unauthorized: Token not found in cookies' };
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        console.log(decoded);
        return decoded;
    } catch (error) {
        return { success: false, message: error.message };
    }
}

module.exports = { getJwt };
