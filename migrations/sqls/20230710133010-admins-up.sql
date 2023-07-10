CREATE TABLE IF NOT EXISTS admins
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    password VARCHAR(255)
);