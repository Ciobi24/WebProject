const dbInstance = require('../models/db-config');

async function aprobareProblemaService(idProblema) {
    try {
        const connection = await dbInstance.connect();
        
        const checkQuery = 'SELECT verified FROM probleme WHERE id = ?';
        const [rows] = await connection.query(checkQuery, [idProblema]);

        if (rows.length === 0) {
            return false;
        }

        const { verified } = rows[0];
        if (verified) {
            return false;
        }

        const updateQuery = 'UPDATE probleme SET verified = true WHERE id = ?';
        const [result] = await connection.query(updateQuery, [idProblema]);

        return (result.affectedRows > 0);
    } catch (error) {
        console.error('Error approving problem:', error);
        return false;
    }
}


async function respingereProblemaService(idProblema) {
    try {
        const connection = await dbInstance.connect();
        
        const checkQuery = 'SELECT verified FROM probleme WHERE id = ?';
        const [rows] = await connection.query(checkQuery, [idProblema]);

        if (rows.length === 0) {
            return false;
        }

        const { verified } = rows[0];
        if (verified) {
            return false;
        }

        const updateQuery = 'DELETE FROM probleme WHERE id = ? AND verified = false';
        const [result] = await connection.query(updateQuery, [idProblema]);

        return (result.affectedRows > 0);
    } catch (error) {
        console.error('Error approving problem:', error);
        return false;
    }
}

module.exports = {aprobareProblemaService, respingereProblemaService }