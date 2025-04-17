CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clothing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    brand TEXT NOT NULL,
    season TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS planned_outfits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    top TEXT,
    bottom TEXT,
    shoes TEXT,
    accessories TEXT,
    occasion TEXT NOT NULL,
    date TEXT,
    gender TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);