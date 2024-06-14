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

module.exports = {
    createTablesUsers,
    createTablesResetPasswordToken
};
