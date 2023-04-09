import dotenv from 'dotenv';

dotenv.config();

export const config = {
    database_prod: process.env.DATABASE_PROD,
    host_prod: process.env.HOST_PROD,
    password_prod: process.env.PASSWORD_PROD as string,
    db_port_prod: process.env.DB_PORT_PROD,
    user_prod: process.env.USER_PROD,

    database_test: process.env.DATABASE_TEST,
    host_test: process.env.HOST_TEST,
    password_test: process.env.PASSWORD_TEST as string,
    db_port_test: process.env.DB_PORT_TEST,
    user_test: process.env.USER_TEST,

    database_dev: process.env.DATABASE_DEV,
    host_dev: process.env.HOST_DEV,
    password_dev: process.env.PASSWORD_DEV as string,
    db_port_dev: process.env.DB_PORT_DEV,
    user_dev: process.env.USER_DEV,

    cloudinairy_cloud_name: process.env.CLOUDINAIRY_CLOUD_NAME,
    cloudinairy_api_key: process.env.CLOUDINAIRY_API_KEY,
    cloudinairy_api_secret: process.env.CLOUDINAIRY_API_SECRET,

    port: process.env.PORT,
    salt: Number(process.env.SALT),
    pepper: process.env.PEPPER,
    secret_key: process.env.SECRET_KEY as string,
    ssl: process.env.SSLMODE,
    ENV: process.env.ENV
}