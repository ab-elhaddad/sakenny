"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("../configuration/config");
let client;
if (config_1.config.ENV === 'prod') {
    client = new pg_1.Pool({
        database: config_1.config.database_prod,
        host: config_1.config.host_prod,
        user: config_1.config.user_prod,
        password: config_1.config.password_prod,
        port: Number(config_1.config.db_port_prod),
        // ssl:{
        //     cert: fs.readFileSync('../../ssl/BaltimoreCyberTrustRoot.crt.pem'),
        //     rejectUnauthorized: true,
        //   },
    });
}
else if (config_1.config.ENV === 'test') {
    client = new pg_1.Pool({
        database: config_1.config.database_test,
        host: config_1.config.host_test,
        user: config_1.config.user_test,
        password: config_1.config.password_test,
        port: Number(config_1.config.db_port_test),
    });
}
else { //dev
    client = new pg_1.Pool({
        database: config_1.config.database_dev,
        host: config_1.config.host_dev,
        user: config_1.config.user_dev,
        password: config_1.config.password_dev,
        port: Number(config_1.config.db_port_dev),
    });
}
exports.default = client;
