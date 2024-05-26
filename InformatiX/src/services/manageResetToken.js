const {
    findResetTokenByEmail,
    updateResetToken,
    insertResetToken
} = require('../models/tokenModel');
const crypto = require('crypto');

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

module.exports = generateAndSaveToken;
