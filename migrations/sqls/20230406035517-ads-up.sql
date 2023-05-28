CREATE TABLE IF NOT EXISTS ads
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    title VARCHAR(50) NOT NULL,
    space_type VARCHAR(4) NOT NULL,
    description VARCHAR(500),
    price REAL NOT NULL,
    city VARCHAR(20) NOT NULL,
    governorate VARCHAR(20) NOT NULL,
    lat VARCHAR(255), 
    lng VARCHAR(255), 
    gender BOOLEAN NOT NULL,
    features BIT(20),
    terms BIT(10),
    price_per VARCHAR(5) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(20) NOT NULL
);