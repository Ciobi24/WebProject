const mysql = require('mysql2/promise');
const createTables = require('./createTabels');

const connectionString = {
  host: "localhost",
  port: 3000,
  user: "alex",
  password: "alex123K!!",
  database: "informatix"
};

let connection;

async function connect() {
  if (connection) {
    return connection;
  }

  try {
    connection = await mysql.createConnection(connectionString);
    console.log("Connected to DB.");

    await connection.execute(createTables.createTablesUsers);
    await connection.execute(createTables.createTablesResetPasswordToken);

    return connection;
  } catch (error) {
    console.error("Error connecting to DB: " + error);
    throw error;
  }
}

module.exports = connect;
