"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
const config_1 = require("../configuration/config");
exports.client = new pg_1.Pool({
    database: config_1.config.database,
    host: config_1.config.host,
    user: config_1.config.user,
    password: config_1.config.password,
    port: Number(config_1.config.port)
});
