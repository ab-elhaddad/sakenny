CREATE TABLE IF NOT EXISTS ads
(
    id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(id),
    space_type VARCHAR(4),
    description VARCHAR(500),
    price REAL,
    city VARCHAR(20),
    address VARCHAR(100),
    lat VARCHAR(255), //Latitude
    lng VARCHAR(255), //Longtitude
    gender BOOLEAN,
    services TEXT[],
    price_per VARCHAR(5)
);