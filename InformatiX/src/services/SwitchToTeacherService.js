const dbInstance = require('../models/db-config');

async function insertTeacherApplication(userId, schoolName, documentPath) {
    let connection;
    try {
        connection = await dbInstance.connect();

        const [existingApplication] = await connection.execute('SELECT * FROM teacher_application WHERE user_id = ?', [userId]);
        if (existingApplication.length > 0) {
            return -1;
        }

        const [result] = await connection.execute('INSERT INTO teacher_application (user_id, school_name, document_path) VALUES (?, ?, ?)', [userId, schoolName, documentPath]);
       return 1;
    } catch (error) {
        console.error('Database Error:', error);
        return 0;
    }
}

async function getApplications() {
    let connection;
    try {
        connection = await dbInstance.connect();
        const [results] = await connection.execute('SELECT * FROM teacher_application');
        return results;
    } catch (error) {
        console.error('Database Error:', error);
        throw error;
    }
}

async function aprobareApplicationService(idUser) {
    let connection;
    try {
        connection = await dbInstance.connect();

        const [userCheck] = await connection.execute('SELECT * FROM users WHERE id = ?', [idUser]);
        if (userCheck.length === 0) {
            return false;
        }

        const [deleteApplication] = await connection.execute('DELETE FROM teacher_application WHERE user_id = ?', [idUser]);
        if (deleteApplication.affectedRows === 0) {
            return false;
        }

        const [updateRole] = await connection.execute('UPDATE users SET role = ? WHERE id = ?', ['profesor', idUser]);
        if (updateRole.affectedRows === 0) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Database Error:', error);
        return false;
    }
}

async function respingereApplicationService(idUser) {
    let connection;
    try {
        connection = await dbInstance.connect();
        const [deleteApplication] = await connection.execute('DELETE FROM teacher_application WHERE user_id = ?', [idUser]);
        if (deleteApplication.affectedRows === 0) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Database Error:', error);
        return false;
    }
}

module.exports = { insertTeacherApplication, getApplications, aprobareApplicationService, respingereApplicationService };
