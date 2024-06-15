const mysql = require('mysql2/promise');
const {createTablesUsers,  createTablesResetPasswordToken}= require('./createTabels');

class Database {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async connect() {
    if (this.connection) {
      return this.connection;
    }

    try {
      this.connection = await mysql.createConnection(this.config);
      console.log("Connected to DB.");

      await this.createTables();
      return this.connection;
    } catch (error) {
      console.error("Error connecting to DB: " + error);
      throw error;
    }
  }

  async createTables() {
    try {
      await this.connection.execute(createTablesUsers);
      await this.connection.execute(createTablesResetPasswordToken);
    } catch (error) {
      console.error("Error creating tables: " + error);
      throw error;
    }
  }
}

const connectionString = {
  host: "localhost",
  port: 3000,
  user: "alex",
  password: "alex123K!!",
  database: "informatix"
};

const dbInstance = new Database(connectionString);

module.exports = dbInstance;
