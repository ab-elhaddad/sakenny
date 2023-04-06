CREATE TABLE IF NOT EXISTS ads_images
(
    id SERIAL PRIMARY KEY,
    ads_id INTEGER REFERENCES ads(id),
    link VARCHAR(255)
);