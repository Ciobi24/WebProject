const connect = require('./db-config');
async function findUserByEmailAndPassword(email, password) {
    const connection = await connect(); 
    try {
        const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
        const [rows, _] = await connection.query(query, [email, password]);
        return rows.length === 1;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } 
}

async function findUserByEmailOrUsername(email, username) {
    const connection = await connect();
    try {
        const query = `SELECT * FROM users WHERE email = ? OR username = ?`;
        const [rows, _] = await connection.query(query, [email, username]);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } 
}       

async function insertUser(username, email, password, role) {
    const connection = await connect();
    try {
        const query = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
        const [results, _] = await connection.query(query, [username, email, password, role]);
        return results;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}
async function findUserByEmail(email) {
    const connection = await connect(); 
    try {
        const query = `SELECT username FROM users WHERE email = ?`;
        const queryResult = await connection.query(query, [email]);
        if(queryResult == 1)
        {
            return queryResult.results;
        }
        else
        {
            return null;
        }
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } 
}


module.exports = {
    findUserByEmailAndPassword,
    findUserByEmailOrUsername,
    insertUser,
    findUserByEmail
};
