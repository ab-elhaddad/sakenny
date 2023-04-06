CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(75) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255)
);