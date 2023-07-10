"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../database/index"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../configuration/config");
class Admins {
    constructor() {
        this.signUp = (username, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield index_1.default.connect();
                // Check if the username is already taken
                const test_sql = 'SELECT * FROM admins WHERE username=($1)';
                const res = yield connection.query(test_sql, [username]);
                if (res.rows.length > 0)
                    return null;
                const sql = 'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING *';
                const encryptedPassword = bcrypt_1.default.hashSync(password, config_1.config.salt);
                const result = yield connection.query(sql, [username, encryptedPassword]);
                const token = jsonwebtoken_1.default.sign(result.rows[0].username, config_1.config.secret_key);
                connection.release();
                return token;
            }
            catch (e) {
                console.log('Error in signUp function in admins.model\n', e);
                return null;
            }
        });
        this.signIn = (username, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield index_1.default.connect();
                const sql = 'SELECT * FROM admins WHERE username=($1)';
                const res = yield connection.query(sql, [username]);
                const encryptedPassword = res.rows[0].password;
                const isRightPassword = bcrypt_1.default.compareSync(password, encryptedPassword);
                connection.release();
                const token = jsonwebtoken_1.default.sign(username, config_1.config.secret_key);
                if (isRightPassword)
                    return token;
                else
                    return null;
            }
            catch (e) {
                console.log('Error in signIn function in admins.model\n', e);
                return null;
            }
        });
    }
}
exports.default = Admins;
