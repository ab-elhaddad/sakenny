CREATE TABLE IF NOT EXISTS ad_images
(
    id SERIAL PRIMARY KEY,
    ad_id INTEGER REFERENCES ads(id),
    url VARCHAR(255),
    description VARCHAR(100)
);