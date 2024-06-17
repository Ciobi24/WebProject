const createTablesUsers = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  lastname VARCHAR(255),
  firstname VARCHAR(255),
  birthday DATE,
  city VARCHAR(255),
  school VARCHAR(255)
);
`;

const createTablesResetPasswordToken = `
CREATE TABLE IF NOT EXISTS reset_password_token (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

const createTablesProbleme = `
CREATE TABLE IF NOT EXISTS probleme (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nume_problema VARCHAR(255) NOT NULL,
  dificultate VARCHAR(255) NOT NULL,
  categorie VARCHAR(255) NOT NULL,
  clasa VARCHAR(255) NOT NULL,
  text_problema TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  rating INT DEFAULT 0,
  utilizatori_incercat INT DEFAULT 0,
  utilizatori_rezolvat INT DEFAULT 0,
  creator_id INT
)`;

module.exports = {
    createTablesUsers,
    createTablesResetPasswordToken,
    createTablesProbleme
};
