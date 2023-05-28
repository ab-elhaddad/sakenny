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
exports.updatePassword = exports.update = exports.profile = exports.resetPassword = exports.login = exports.register = void 0;
const users_model_1 = require("../models/users.model");
const uploadImages_1 = __importDefault(require("./functions/uploadImages"));
const users = new users_model_1.Users();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = {
            fullname: req.body.fullname,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: req.body.password,
            profile_pic: req.files ? req.files[0].path : undefined
        };
        //console.log(input);
        const result = yield users.register(input);
        if (result === "The Email Or Phone Number Already Used") {
            res.json({
                Message: result,
                Flag: false
            }).status(401);
        }
        else {
            res.json({
                Message: 'Registered Successfully',
                Flag: true,
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
        if (result === 'Wrong Email Or Phone Number!') {
            res.json({
                Message: result,
                Flag: false,
            }).status(401);
        }
        else if (result === 'Wrong Password!') {
            res.json({
                Message: result,
                Flag: false
            }).status(403);
        }
        else {
            res.json({
                Message: "Logged in Successfully",
                Flag: true,
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
        if (result === 'Password Reset Failed')
            res.json({ Message: result, Flag: false }).status(401);
        else
            res.json({ Message: result, Flag: true });
    }
    catch (e) {
        console.error('Error in resetPassword function in users.controller');
        throw (e);
    }
});
exports.resetPassword = resetPassword;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield users.profile(res.locals.user);
        if (!result) {
            res.json({
                Message: 'Wrong email or phone number',
                Flag: false,
            }).status(401);
        }
        else {
            res.json(Object.assign({ Message: 'Data Retrieved Successfully', Flag: true }, result));
        }
    }
    catch (e) {
        console.log("Error in profile function in users.controller", e);
    }
});
exports.profile = profile;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check whether the desired update in profile pic to upload it
        let profile_pic;
        if (req.files)
            profile_pic = (yield (0, uploadImages_1.default)(req.files, 'Profile Images'))[0];
        const result = yield users.update(res.locals.user, req.body.new_fullname, req.body.new_email, req.body.new_phone_number, profile_pic);
        if (!result.Message.includes("successfully")) // Not Successfully
            res.json({ Message: result.Message, Flag: false }).status(403);
        else
            res.json(Object.assign(Object.assign({}, result), { Flag: true }));
    }
    catch (e) {
        console.log("Error in update function in users.controller", e);
    }
});
exports.update = update;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(res.locals.user, req.body.old_password, req.body.new_password);
        const result = yield users.updatePassword(res.locals.user, req.body.old_password, req.body.new_password);
        if (result.includes('Successfully'))
            res.json({ Message: result, Flag: true });
        else
            res.json({ Message: result, Flag: false }).status(403);
    }
    catch (e) {
        console.log('Error in updatePassword in users.controller');
        throw e;
    }
});
exports.updatePassword = updatePassword;
