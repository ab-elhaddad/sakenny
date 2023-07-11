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
exports._delete_ = exports._updateImage_ = exports._update_password_ = exports._update_ = exports._read_ = exports._create_ = exports.updatePassword = exports.update = exports.profile = exports.resetPassword = exports.login = exports.register = void 0;
const users_model_1 = require("../models/users.model");
const uploadImages_1 = __importDefault(require("./functions/uploadImages"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../configuration/config");
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
// CRUD Operations
const _create_ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inputUser = {
            fullname: req.body.fullname,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: bcrypt_1.default.hashSync(req.body.password, config_1.config.salt)
        };
        yield users._create(inputUser);
        res.json({ Message: 'User Created Successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _create function in users.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false }).status(500);
    }
});
exports._create_ = _create_;
const _read_ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield users._read();
        res.json({ Message: 'Data Retrieved Successfully', Flag: true, Users: result });
    }
    catch (e) {
        console.log('Error in _read function in users.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false }).status(500);
    }
});
exports._read_ = _read_;
const _update_ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // All data is required however it is not required to change all data
    try {
        const inputUser = {
            id: req.body.id,
            fullname: req.body.fullname,
            email: req.body.email,
            phone_number: req.body.phone_number
        };
        yield users._update(inputUser);
        res.json({ Message: 'User Updated Successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _update function in users.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false }).status(500);
    }
});
exports._update_ = _update_;
const _update_password_ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const password = bcrypt_1.default.hashSync(req.body.password, config_1.config.salt);
        yield users._update_password(id, password);
        res.json({ Message: 'User Password Updated Successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _update_password function in users.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false }).status(500);
    }
});
exports._update_password_ = _update_password_;
const _updateImage_ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = (yield (0, uploadImages_1.default)(req.files, 'Profile Images'))[0];
        yield users._updatePicture(req.body.id, url);
        res.json({ Message: `User's image Updated Successfully`, Flag: true });
    }
    catch (e) {
        console.log('Error in _updateImage function in users.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false }).status(500);
    }
});
exports._updateImage_ = _updateImage_;
const _delete_ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield users._delete(req.body.id);
        res.json({ Message: 'User Deleted Successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _delete function in users.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false }).status(500);
    }
});
exports._delete_ = _delete_;
