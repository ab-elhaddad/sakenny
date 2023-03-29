import { Pool } from 'pg';
import { config } from '../configuration/config';

export const client = new Pool({
    database: config.database,
    host: config.host,
    user: config.user,
    password: config.password as string,
    port: Number(config.db_port)
});