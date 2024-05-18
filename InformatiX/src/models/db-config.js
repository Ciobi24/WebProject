const mysql = require('mysql');
const createTables = require('./createTabels');

const connectionString = {
  host: "localhost",  // pt ca ruleaza pe aceiasi masina cu aplicatia web
  port: 3000, // port-ul utilizat
  user: "alex", // userul conectat la instanta de BD
  password: "alex123K!!", // parola
  database: "informatix" // baza de date la care se incearca conexiunea
};

let connection;

async function connect() {
  if (connection) {
    return connection; // folosesc o singura data apelul de a crea o conexiune - am de a face cu un singleton
  }

  try {
    connection = await mysql.createConnection(connectionString);
    console.log("Connected to DB.");

    await connection.query(createTables); // creare tabele - in cazul in care nu exista

    return connection;
  } catch (error) {
    console.error("Error connecting to DB: " + error);
    throw error;
  }
}

module.exports = connect;
