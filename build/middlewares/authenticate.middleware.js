"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../configuration/config");
const authenticate = express_1.default.Router();
authenticate.use((req, res, next) => {
    try {
        const enteredToken = req.headers.authorization;
        //const rawToken = enteredToken.substring(enteredToken.indexOf(' ') + 1);
        const rawToken = enteredToken.split(' ')[1];
        jsonwebtoken_1.default.verify(rawToken, config_1.config.secret_key);
        next();
    }
    catch (e) {
        res.json({ Message: 'Invalid Token' }).status(401);
    }
});
exports.default = authenticate;
