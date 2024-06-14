const connect = require('./db-config');

async function findResetTokenByEmail(email) {
    try {
        const connection = await connect(); 
        const query = 'SELECT reset_password_token.token FROM reset_password_token INNER JOIN users ON reset_password_token.user_id = users.id WHERE users.email = ?';
        const [rows, fields] = await connection.query(query, [email]);
        return rows.length > 0 ? rows[0].token : null;
    } catch (error) {
        console.error('Error finding reset token by email:', error);
        throw error;
    }
}

async function updateResetToken(email, resetToken) {
    try {
        const connection = await connect(); 
        const query = 'UPDATE reset_password_token SET token = ? WHERE user_id = (SELECT id FROM users WHERE email = ?)';
        await connection.query(query, [resetToken, email]);
    } catch (error) {
        console.error('Error updating reset token:', error);
        throw error;
    }
}

async function insertResetToken(email, resetToken, expiresAt) {
    try {
        const connection = await connect(); 
        const query = 'INSERT INTO reset_password_token (user_id, token, expires_at) SELECT id, ?, ? FROM users WHERE email = ?';
        await connection.query(query, [resetToken, expiresAt, email]);
    } catch (error) {
        console.error('Error inserting reset token:', error);
        throw error;
    }
}

async function checkValabilyTokens() {
    try {
        const connection = await connect(); 
        const query = `DELETE FROM reset_password_token WHERE expires_at < CURRENT_TIMESTAMP;`;
        await connection.query(query);
    } catch(error) {
        console.error("Error interacting with DB", error);
        throw error;
    }
}


module.exports = {
    findResetTokenByEmail,
    updateResetToken,
    insertResetToken,
    checkValabilyTokens
};
