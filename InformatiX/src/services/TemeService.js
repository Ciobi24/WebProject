const dbInstance = require('../models/db-config'); 

async function createTemaService(nume, deadline, classId, userId) {
    let connection;
    try {
        const connection = await dbInstance.connect();

        let query = 'SELECT * FROM clase WHERE id = ? AND id_user = ?';
        let [rows] = await connection.query(query, [classId, userId]);
        if (rows.length === 0) {
            return 2; 
        }

        query = 'SELECT * FROM teme WHERE nume = ? AND id_clasa = ?';
        [rows] = await connection.query(query, [nume, classId]);
        if (rows.length > 0) {
            return 3; 
        }

        query = 'INSERT INTO teme (nume, deadline, id_clasa) VALUES (?, ?, ?)';
        const result = await connection.query(query, [nume, deadline, classId]);

        if(result.affectedRows) 
           return 2;
        else
           return 1; 
    } catch (error) {
        console.error('Error:', error);
        return 2; 
    } 
}

module.exports = { createTemaService };
