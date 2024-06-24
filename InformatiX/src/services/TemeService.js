const dbInstance = require('../models/db-config'); 

async function createTemaService(nume, deadline, classId, userId) {
    let connection;
    try {
        connection = await dbInstance.connect();

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

async function getTemeByIdClass(classId, userId) {
    let connection; 
    try {
        connection = await dbInstance.connect();
        const [classCheck1] = await connection.execute(
            'SELECT * FROM clase WHERE id = ? AND id_user = ?',
            [classId, userId]
        );
        const [classCheck2] = await connection.execute(
            'SELECT * FROM clase_elevi WHERE id_user = ? AND id_clasa = ?',
            [userId, classId]
        );

        if (classCheck1.length === 0 && classCheck2.length === 0) {  //protectie
            return null;
        }

        const [results] = await connection.execute(
            'SELECT * FROM teme WHERE id_clasa = ?',
            [classId]
        );

        return results;
    } catch (error) {
        console.error('Database Error:', error);
        throw error;
    }
}

async function getProblemeByIdTema(idTema, userId)
{
    let connection; 
    try {
        connection = await dbInstance.connect();
        const [classCheck1] = await connection.execute(
            'SELECT * FROM clase WHERE id_user = ?',
            [userId]
        );

        const [classCheck2] = await connection.execute(
            'SELECT * FROM clase_elevi WHERE id_user = ?',
            [userId]
        );

        if (classCheck1.length === 0 && classCheck2.length === 0) {  
            return null;
        }

        const [results] = await connection.execute(
            'SELECT p.nume_problema, p.id, p.dificultate FROM probleme_teme pt JOIN probleme p ON pt.id_problema = p.id WHERE pt.id_tema = ?',
            [idTema]
        );

        return results;
    } catch (error) {
        console.error('Database Error:', error);
        throw error;
    }
}

async function addProblemToTemaService(problemId, idTema, idUser) {
    let connection;
    try {
        connection = await dbInstance.connect();
       
        let query3 = 'SELECT * FROM probleme WHERE id = ?';
        let [rows3] = await connection.query(query3, [problemId]);
        if(!rows3[0].id)
            return false;

        let query2 = 'SELECT id_clasa FROM teme WHERE id = ?';
        let [rows2] = await connection.query(query2, [idTema]);

        if(!rows2[0].id_clasa)
            return false;

        let query = 'SELECT * FROM clase WHERE id = ? AND id_user = ?';
        let [rows4] = await connection.query(query, [rows2[0].id_clasa, idUser]);
        if (!rows4[0].id) {
            return false; 
        }
        query = 'SELECT * FROM probleme_teme WHERE id_problema = ? AND id_tema = ?';
        let [rows] = await connection.query(query, [problemId, idTema]);
        if (rows[0]) {
            return false; 
        }

        query = 'INSERT INTO probleme_teme (id_tema, id_problema) VALUES (?, ?)';
        const result = await connection.query(query, [idTema, problemId]);

        if(result.affectedRows) 
           return false;
        else
           return true; 
    } catch (error) {
        console.error('Error:', error);
        return 2; 
    } 
}

module.exports = { createTemaService, getTemeByIdClass, getProblemeByIdTema, addProblemToTemaService};
