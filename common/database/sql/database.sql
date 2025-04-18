CREATE TABLE IF NOT EXISTS users (  
  id          INTEGER PRIMARY KEY AUTOINCREMENT,  
  name        TEXT UNIQUE,  
  address     TEXT,  
  click_count INTEGER DEFAULT 0  
);  