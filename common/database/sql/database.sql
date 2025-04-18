CREATE TABLE IF NOT EXISTS users (  
      id          INT AUTO_INCREMENT PRIMARY KEY,  
      name        VARCHAR(255) UNIQUE,  
      address    VARCHAR(255)
);