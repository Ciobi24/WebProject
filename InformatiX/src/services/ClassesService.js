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

async function checkDuplicateClassName(id, className) {
    const connection = await dbInstance.connect();
    try {
        const query = `
            SELECT COUNT(*) AS count
            FROM clase
            WHERE nume LIKE ? AND id_user = ?;
        `;
        const [rows] = await connection.query(query, [className, id]);

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

async function getUsersByClassId(classId) {
    const connection = await dbInstance.connect();
    try {
        const [rows] = await connection.query(`
            SELECT u.id, u.firstname, u.lastname, u.email
            FROM clase_elevi ce
            JOIN users u ON ce.id_user = u.id
            WHERE ce.id_clasa = ?
        `, [classId]);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

async function addUserToClass(id_user, id_clasa) {
    const connection = await dbInstance.connect();
    try {
        const exists = `
        SELECT COUNT(*) AS count
        FROM users
        WHERE id = ?
    `;
    
    const [findUser] = await connection.query(exists, [id_user]);
    
    if (findUser.length !== 1 || findUser[0].count !== 1) {
        return { success: false, message: 'Utilizatorul cu id-ul specificat nu există.' };
    }

        const checkQuery = `
            SELECT COUNT(*) AS count
            FROM clase_elevi
            WHERE id_clasa = ? AND id_user = ?
        `;
        const [checkRows] = await connection.query(checkQuery, [id_clasa, id_user]);

        if (checkRows[0].count > 0) {
            return { success: false, message: 'Utilizatorul există deja în clasă.' };
        } else {
            const insertQuery = `
                INSERT INTO clase_elevi (id_clasa, id_user)
                VALUES (?, ?)
            `;
            await connection.query(insertQuery, [id_clasa, id_user]);
            return { success: true, message: 'Utilizatorul a fost adăugat în clasă cu succes.' };
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
    checkDuplicateClassName,
    getUsersByClassId,
    addUserToClass
};