const dbInstance = require('../models/db-config');

async function getUserById(id) {
    const connection = await dbInstance.connect();
    try {
        const query = `SELECT * FROM users WHERE id = ?`;
        const [rows, _] = await connection.query(query, [id]);
        return rows[0]; 
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

async function findUserByEmailAndPassword(email, password) {
    const connection = await dbInstance.connect(); 
    try {
        const query = `SELECT id FROM users WHERE email = ? AND password = ?`;
        const [rows, _] = await connection.query(query, [email, password]);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } 
}

async function findUserByEmailOrUsername(email, username) {
  const connection = await dbInstance.connect(); 
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
    const connection = await dbInstance.connect(); 
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
    const connection = await dbInstance.connect(); 
    try {
      const [rows] = await connection.query('SELECT username FROM users WHERE email = ?', [email]);
      if (rows.length == 1) {
        return rows[0].username;
      } else {
        return null; 
      }
    } catch (error) {
      console.error("Error interacting with DB: " + error);
      throw error;
    }
  }

async function updatePassword(newPassword, email)
{
    const connection = await dbInstance.connect(); 
    try {
        const query = 'UPDATE users SET password = ? WHERE email = ?';
        const [result] = await connection.query(query, [newPassword, email]);
        if (result.affectedRows === 1) {
            const [rows] = await connection.query('SELECT username FROM users WHERE email = ?', [email]);
            if (rows.length == 1) {
                return rows[0].username;  // ce user este actualizat, returnez!!
            } else {
                return null; // nu s-a actualizat nimic
            }
        } else {
            console.log('No user found with this email.');
            return null;
        }
    } catch (error) {
        console.error("Error interacting with DB: " + error);
        throw error;
    }
}

async function updateUserByCredentials(userId, userData) {
    const connection = await dbInstance.connect();
    try {
        console.log(userData.email);

        const query = `
            UPDATE users 
            SET lastname = ?, firstname = ?, birthday = ?, city = ?, school = ? 
            WHERE id = ?
        `;
        // const [result] = await connection.query(query, [lastname, firstname, birthday, city, school, userId]);

        // console.log('Query result:', result);

        // if (result.affectedRows === 1) {
        //     console.log("User updated successfully!");
        //     const updatedUser = await getUserById(userId);
        //     return updatedUser;
        // } else {
        //     console.log('No user found with this id or no changes were made.');
        //     return null;
        // }
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

module.exports = {
    findUserByEmailAndPassword,
    findUserByEmailOrUsername,
    insertUser,
    findUserByEmail,
    updatePassword,
    getUserById,
    updateUserByCredentials
};
