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
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.resetPassword = exports.login = exports.register = void 0;
const users_model_1 = require("../models/users.model");
const users = new users_model_1.Users();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = {
            fullname: req.body.fullname,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: req.body.password
        };
        console.log(req.body.email, req.body.phone_number);
        const result = yield users.register(input);
        if (result === "The Email Or Phone Number Already Used") {
            res.json({
                Message: result
            }).status(401);
        }
        else {
            res.json({
                Message: 'Registered Successfully',
                Token: result
            });
        }
    }
    catch (e) {
        console.error(`Error in register function in users controller`);
        throw (e);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield users.login(req.body.email, req.body.phone_number, req.body.password);
        if (result === 'Wrong Email Or Phone Number!' || result === 'Wrong Password!') {
            res.json({
                Message: result
            }).status(401);
        }
        else {
            res.json({
                Message: "Logged in Successfully",
                Token: result
            });
        }
    }
    catch (e) {
        console.error(`Error in login function in users controller`);
        throw (e);
    }
});
exports.login = login;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield users.resetPassword(req.body.email, req.body.phone_number, req.body.new_password);
        res.json({ Message: result });
        if (result === 'Password Reset Failed')
            res.status(402);
    }
    catch (e) {
        console.error('Error in resetPassword function in users.controller');
        throw (e);
    }
});
exports.resetPassword = resetPassword;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users.profile(req.body.email, req.body.phone_number);
    res.json(Object.assign({ Message: 'Data Retrieved Successfully' }, result));
});
exports.profile = profile;
