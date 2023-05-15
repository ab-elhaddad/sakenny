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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../configuration/config");
const index_1 = __importDefault(require("../database/index"));
const authenticate = express_1.default.Router();
const exists = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield index_1.default.connect();
    const sql = "SELECT * FROM users WHERE email=$1 OR phone_number=$1";
    const result = yield connection.query(sql, [user]);
    connection.release();
    return result.rowCount > 0;
});
authenticate.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enteredToken = req.headers.authorization;
        //const rawToken = enteredToken.substring(enteredToken.indexOf(' ') + 1);
        const rawToken = enteredToken.split(' ')[1];
        res.locals.user = jsonwebtoken_1.default.verify(rawToken, config_1.config.secret_key);
        if (!(yield exists(res.locals.user)))
            res.json({ Message: 'Invalid Token [Old Token]' }).status(403);
        next();
    }
    catch (e) {
        res.json({ Message: 'Invalid Token' }).status(403);
        throw e;
    }
}));
exports.default = authenticate;
