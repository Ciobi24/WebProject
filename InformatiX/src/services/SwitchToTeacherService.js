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

module.exports = { insertTeacherApplication, getApplications };
