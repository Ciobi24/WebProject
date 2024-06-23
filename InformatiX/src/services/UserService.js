const dbInstance = require('../models/db-config');
const bcrypt = require('bcrypt');

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
        const query = `SELECT id, role, password FROM users WHERE email = ?`;
        const [rows, _] = await connection.query(query, [email]);
    
        if (rows.length === 0) {
            return false;
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            return true
        } else {
            return false
        }
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

async function getAllUsers() {
    const connection = await dbInstance.connect();
    try {
        const query = `SELECT id, username, role, lastname, firstname, birthday, city, school FROM users`;
        const [rows, _] = await connection.query(query);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}
async function deleteUser(idUser) {
    const connection = await dbInstance.connect();
    try { 
        const query1 = `DELETE FROM users WHERE id = ?`;
        const query2 = `DELETE FROM clase_elevi WHERE iduser = ?`
        const [rows, _] = await connection.query(query, [idUser]);
        return rows;
    }
    catch (error) {
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

async function updatePassword(newPassword, email) {
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

async function updateUserByCredentials(userFromDB, userData) {
    const connection = await dbInstance.connect();
    try {
        const currentUser = await getUserById(userFromDB.id);
        const userId = userFromDB.id;

        if (!currentUser) {
            console.log('No user found with this id');
            return null;
        }

        const updatePromises = [];

        if (userData.lastname !== undefined && userData.lastname !== userFromDB.lastname) {
            updatePromises.push(connection.query('UPDATE users SET lastname = ? WHERE id = ?', [userData.lastname, userId]));
        }

        if (userData.firstname !== undefined && userData.firstname !== userFromDB.firstname) {
            updatePromises.push(connection.query('UPDATE users SET firstname = ? WHERE id = ?', [userData.firstname, userId]));
        }

        if (userData.birthday !== undefined && userData.birthday !== userFromDB.birthday) {
            const birthdayDate = new Date(userData.birthday);
            birthdayDate.setDate(birthdayDate.getDate() + 1);
            const formattedBirthday = birthdayDate.toISOString().slice(0, 10);
            updatePromises.push(connection.query('UPDATE users SET birthday = ? WHERE id = ?', [formattedBirthday, userId]));
        }

        if (userData.city !== undefined && userData.city !== userFromDB.city) {
            updatePromises.push(connection.query('UPDATE users SET city = ? WHERE id = ?', [userData.city, userId]));
        }

        if (userData.school !== undefined && userData.school !== userFromDB.school) {
            updatePromises.push(connection.query('UPDATE users SET school = ? WHERE id = ?', [userData.school, userId]));
        }

        await Promise.all(updatePromises);

        const updatedUser = await getUserById(userId);
        console.log('User updated successfully!');
        return updatedUser;

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
    updateUserByCredentials,
    getAllUsers,
    deleteUser
};
