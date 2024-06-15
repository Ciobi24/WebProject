const jwt = require('jsonwebtoken');
const secretKey = 'secret';

function verifyToken(req, res, next) {
    // Extrage token-ul din antetul de autorizare sau din cookie-ul de sesiune
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    // Verifică dacă token-ul există
    if (!token) {
        return res.status(401).json({ success: false, message: 'Acces interzis. Token lipsă.' });
    }

    try {
        // Verifică token-ul
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded;

        // Continuă procesarea cererii
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Acces interzis. Token invalid.' });
    }
}

module.exports = verifyToken;
