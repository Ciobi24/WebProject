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
  rating FLOAT DEFAULT 0,
  nr_rating INT DEFAULT 0,
  utilizatori_incercat INT DEFAULT 0,
  utilizatori_rezolvat INT DEFAULT 0,
  creator_id INT,
  FOREIGN KEY (creator_id) REFERENCES users(id)
);
`;

const createTablesRating = `
CREATE TABLE IF NOT EXISTS rating (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_problema INT NOT NULL,
  id_user INT NOT NULL,
  rating FLOAT NOT NULL,
  UNIQUE KEY unique_rating (id_problema, id_user),
  FOREIGN KEY (id_problema) REFERENCES probleme(id),
  FOREIGN KEY (id_user) REFERENCES users(id)
);
`;

module.exports = {
    createTablesUsers,
    createTablesResetPasswordToken,
    createTablesProbleme,
    createTablesRating
};
