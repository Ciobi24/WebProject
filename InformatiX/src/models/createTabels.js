
const createTabels = `
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
)
`;

module.exports = createTabels;
