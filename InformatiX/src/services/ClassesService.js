const dbInstance = require('../models/db-config');

async function getClassesForElev(userId) {
    const connection = await dbInstance.connect();
    try {
        const query = `
            SELECT *
            FROM clase_elevi ce
            JOIN clase c ON ce.id_clasa = c.id
            WHERE ce.id_user = ?;
        `;
        const [rows, _] = await connection.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

async function getClassesForProf(userId) {
    const connection = await dbInstance.connect();
    try {
        const query = `SELECT * FROM clase WHERE id_user = ?;`;
        const [rows, _] = await connection.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

async function insertClass(className, idProf) {
    const connection = await dbInstance.connect();
    try {
        const query = `
            INSERT INTO clase (nume, id_user)
            VALUES (?, ?);
        `;
        const [result] = await connection.query(query, [className, idProf]);
        
        if (result.affectedRows > 0) {
            return true; 
        } else {
            return false; 
        }
    } catch (error) {
        console.error('Error executing query:', error);
        throw error; 
    } 
}

async function checkDuplicateClassName(className) {
    const connection = await dbInstance.connect();
    try {
        const query = `
            SELECT COUNT(*) AS count
            FROM clase
            WHERE nume LIKE ?;
        `;
        const [rows] = await connection.query(query, [className]);
        console.log(rows[0].count);
        if (rows[0].count > 0) {
            return true; 
        } else {
            return false; 
        }
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } 
}

module.exports = {
    getClassesForProf,
    getClassesForElev,
    insertClass,
    checkDuplicateClassName
};