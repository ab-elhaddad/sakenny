import dotenv from 'dotenv';

dotenv.config();

export const config = {
    database: process.env.DATABASE,
    host: process.env.HOST,
    password: process.env.PASSWORD as string,
    port: process.env.PORT,
    db_port: process.env.DB_PORT,
    user: process.env.USER,
    salt: Number(process.env.SALT),
    pepper: process.env.PEPPER,
    secret_key: process.env.SECRET_KEY as string,
}