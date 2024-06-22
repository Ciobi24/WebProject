const dbInstance = require('../models/db-config');

async function insertTeacherApplication(userId, schoolName, documentPath) {
    let connection;
    try {
        connection = await connectToDatabase();
        const [result] = await connection.execute('INSERT INTO teacher_application (user_id, school_name, document_path) VALUES (?, ?, ?)', [userId, schoolName, documentPath]);
        return result.insertId;
    } catch (error) {
        console.error('Database Error:', error);
        throw error;
    }
}

module.exports = { insertTeacherApplication}