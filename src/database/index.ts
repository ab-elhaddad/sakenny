import { Pool } from 'pg';
import { config } from '../configuration/config';
import fs from 'fs';

let client: Pool;

if (config.ENV === 'prod') {
    client = new Pool({
        database: config.database_prod,
        host: config.host_prod,
        user: config.user_prod,
        password: config.password_prod as string,
        port: Number(config.db_port_prod),
        // ssl:{
        //     cert: fs.readFileSync('../../ssl/BaltimoreCyberTrustRoot.crt.pem'),
        //     rejectUnauthorized: true,
        //   },
    });
} else if (config.ENV === 'test') {
    client = new Pool({
        database: config.database_test,
        host: config.host_test,
        user: config.user_test,
        password: config.password_test as string,
        port: Number(config.db_port_test),
    });
} else { //dev
    client = new Pool({
        database: config.database_dev,
        host: config.host_dev,
        user: config.user_dev,
        password: config.password_dev as string,
        port: Number(config.db_port_dev),
    });
}

export default client;