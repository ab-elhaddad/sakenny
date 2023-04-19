CREATE TABLE IF NOT EXISTS ads
(
    id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(id),
    title VARCHAR(50) NOT NULL,
    space_type VARCHAR(4) NOT NULL,
    description VARCHAR(500),
    price REAL NOT NULL,
    city VARCHAR(20) NOT NULL,
    address VARCHAR(100) NOT NULL,
    lat VARCHAR(255), 
    lng VARCHAR(255), 
    gender BOOLEAN NOT NULL,
    services TEXT[],
    pics TEXT[],
    price_per VARCHAR(5) NOT NULL
);