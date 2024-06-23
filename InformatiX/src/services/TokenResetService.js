const crypto = require('crypto');
const dbInstance = require('../models/db-config');

async function findResetTokenByEmail(email) {
    try {
        const connection = await dbInstance.connect(); 
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
        const connection = await dbInstance.connect(); 
        const query = 'UPDATE reset_password_token SET token = ? WHERE user_id = (SELECT id FROM users WHERE email = ?)';
        await connection.query(query, [resetToken, email]);
    } catch (error) {
        console.error('Error updating reset token:', error);
        throw error;
    }
}

async function insertResetToken(email, resetToken, expiresAt) {
    try {
        const connection = await dbInstance.connect(); 
        const query = 'INSERT INTO reset_password_token (user_id, token, expires_at) SELECT id, ?, ? FROM users WHERE email = ?';
        await connection.query(query, [resetToken, expiresAt, email]);
    } catch (error) {
        console.error('Error inserting reset token:', error);
        throw error;
    }
}

async function checkValabilyTokens() {
    try {
        const connection = await dbInstance.connect(); 
        const query = `DELETE FROM reset_password_token WHERE expires_at < CURRENT_TIMESTAMP;`;
        await connection.query(query);
    } catch(error) {
        console.error("Error interacting with DB", error);
        throw error;
    }
}

async function getEmailByResetToken(resetToken)
{
    try {
        const connection = await dbInstance.connect(); 
        const query = `SELECT email FROM users s JOIN reset_password_token r ON s.id = r.user_id WHERE r.token = ?;`;
        const [row] = await connection.query(query, resetToken);
        return row[0].email;
    } catch(error) {
        console.error("Error interacting with DB", error);
        throw error;
    }
}

async function destroyResetToken(resetToken) {
    try {
        const connection = await dbInstance.connect(); 
        const query = `DELETE FROM reset_password_token WHERE token = ?;`;
        const [result] = await connection.query(query, resetToken);

        if (result.affectedRows === 1) {
            return true;
        } else {
            console.log("Reset token not found.");
            return false;
        }
    } catch(error) {
        console.error("Error interacting with DB", error);
        throw error;
    }
}

async function checkTokenExistence(resetToken) {
    try {
        const connection = await dbInstance.connect(); 
        const selectQuery = `SELECT u.email FROM users u JOIN reset_password_token r ON r.user_id = u.id WHERE r.token = ?;`;
        const [row] = await connection.query(selectQuery, resetToken);

        if (row.length > 0) {
            return row[0].email; 
        } else {
            return null; 
        }
    } catch(error) {
        console.error("Error checking token in database", error);
        throw error;
    }
}

function generateUniqueToken() {
    return crypto.randomBytes(32).toString('hex');
}

async function generateAndSaveToken(email, expiresAt) {
    try {
        const resetToken = generateUniqueToken();
        const existingToken = await findResetTokenByEmail(email);

        if (existingToken) {
            await updateResetToken(email, resetToken);
        }
        else {
            await insertResetToken(email, resetToken, expiresAt);
        }
        return resetToken;
    } catch (error) {
        console.error('Error generating and saving token:', error);
        throw error;
    }
}

module.exports = {
    findResetTokenByEmail,
    updateResetToken,
    insertResetToken,
    checkValabilyTokens,
    getEmailByResetToken,
    destroyResetToken,
    generateAndSaveToken,
    checkTokenExistence
};