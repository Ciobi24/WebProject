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
  school VARCHAR(255),
  incercari INT DEFAULT 0,
  rezolvate INT DEFAULT 0
);
`;

const createTablesResetPasswordToken = `
CREATE TABLE IF NOT EXISTS reset_password_token (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;
const createTablesTeacherApplication = `
CREATE TABLE IF NOT EXISTS teacher_application (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  school_name VARCHAR(255) NOT NULL,
  document_path VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
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
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);
`;

const createTablesClase = `
CREATE TABLE IF NOT EXISTS clase (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nume VARCHAR(255) NOT NULL,
  id_user INT NOT NULL,
  UNIQUE KEY unique_class_name_user_id (nume, id_user),
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);
`;

const createTablesClasaElev = `
CREATE TABLE IF NOT EXISTS clase_elevi (
  id_clasa INT NOT NULL,
  id_user INT NOT NULL,
  PRIMARY KEY (id_clasa, id_user),
  FOREIGN KEY (id_clasa) REFERENCES clase(id) ON DELETE CASCADE, 
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);
`;
const createTablesTeme = `
CREATE TABLE IF NOT EXISTS teme (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nume VARCHAR(255) NOT NULL,
  deadline DATE NOT NULL,
  id_clasa INT NOT NULL,
  UNIQUE KEY pereche_unica (nume, id_clasa),
  FOREIGN KEY (id_clasa) REFERENCES clase(id) ON DELETE CASCADE
);
`;

const createTablesProblemeTeme = `
CREATE TABLE IF NOT EXISTS probleme_teme (
  id_tema INT NOT NULL,
  id_problema INT NOT NULL,
  PRIMARY KEY (id_tema, id_problema),
  FOREIGN KEY (id_tema) REFERENCES teme(id),
  FOREIGN KEY (id_problema) REFERENCES probleme(id) ON DELETE CASCADE
);
`;

const createTablesSolutii = `
CREATE TABLE IF NOT EXISTS solutii (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_problema INT NOT NULL,
  id_user INT NOT NULL,
  id_tema INT NOT NULL,
  text_solutie TEXT,
  comentariu TEXT,
  comentariu_prof TEXT,
  nota INT,
  FOREIGN KEY (id_problema) REFERENCES probleme(id) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
);
`;


module.exports = {
    createTablesUsers,
    createTablesResetPasswordToken,
    createTablesProbleme,
    createTablesRating,
    createTablesClase,
    createTablesClasaElev,
    createTablesTeme,
    createTablesProblemeTeme,
    createTablesSolutii,
    createTablesTeacherApplication
};

