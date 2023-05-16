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
exports.Users = void 0;
const index_1 = __importDefault(require("./../database/index"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../configuration/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const storeImages_1 = __importDefault(require("./functions/storeImages"));
class Users {
    register(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (yield index_1.default.connect()).on('error', (e) => { console.log(e); });
                //Check Whether There exist account with the same email or phone number
                const testSQL = input.email !== undefined ? "SELECT * FROM users WHERE email=$1" : "SELECT * FROM users WHERE phone_number=$1";
                const testRes = yield connection.query(testSQL, [input.email !== undefined ? input.email : input.phone_number]);
                if (testRes.rowCount > 0)
                    return "The Email Or Phone Number Already Used";
                //Getting hashed password to be stored in db
                const hashedPassword = bcrypt_1.default.hashSync(input.password, config_1.config.salt);
                //Uploading profile picture to cloudinairy and getting the link
                const url = yield (0, storeImages_1.default)(input.profile_pic ? [input.profile_pic] : [], 'Profile Images')[0];
                console.log(url);
                const sql = "INSERT INTO users (fullname, email, phone_number, password, profile_pic) VALUES ($1, $2, $3, $4, $5) RETURNING *";
                const res = yield connection.query(sql, [input.fullname, input.email, input.phone_number, hashedPassword, url]);
                connection.release();
                //Returning token geerated by email or phone number
                return jsonwebtoken_1.default.sign(res.rows[0].email === null ? res.rows[0].phone_number : res.rows[0].email, config_1.config.secret_key);
            }
            catch (e) {
                console.error(`Error in register function in users.model function`);
                throw (e);
            }
        });
    }
    login(email, phone_number, plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (yield index_1.default.connect()).on('error', (e) => { console.log(e); });
                let res;
                if (email === undefined) {
                    const sql = "SELECT * FROM users WHERE phone_number=($1)";
                    res = yield connection.query(sql, [phone_number]);
                }
                else {
                    const sql = "SELECT * FROM users WHERE email=($1)";
                    res = yield connection.query(sql, [email]);
                }
                setTimeout(() => { connection.release(); }, 1000);
                if (res.rowCount === 0)
                    return 'Wrong Email Or Phone Number!';
                const exists = bcrypt_1.default.compareSync(plainPassword, res.rows[0].password);
                if (exists)
                    return jsonwebtoken_1.default.sign(email === undefined ? phone_number : email, config_1.config.secret_key);
                else
                    return 'Wrong Password!';
            }
            catch (e) {
                console.error(`Error in login in Users Model ${e}`);
                throw (e);
            }
        });
    }
    resetPassword(email, phone_number, new_password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (yield index_1.default.connect()).on('error', (e) => { console.log(e); });
                const newHashedPassword = bcrypt_1.default.hashSync(new_password, config_1.config.salt);
                let result;
                if (email === undefined) {
                    const sql = "UPDATE users SET password = $2 WHERE phone_number=$1 RETURNING password";
                    result = yield connection.query(sql, [phone_number, newHashedPassword]);
                }
                else {
                    const sql = "UPDATE users SET password = $2 WHERE email=$1 RETURNING password";
                    result = yield connection.query(sql, [email, newHashedPassword]);
                }
                connection.release();
                console.log(result);
                if (result.rows[0].password === newHashedPassword)
                    return ('Password Reset Successfully');
                else
                    return ('Password Reset Failed');
            }
            catch (e) {
                console.error('Error in resetPassword function in users.model');
                throw (e);
            }
        });
    }
    profile(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (yield index_1.default.connect());
                const sql = "SELECT * FROM users WHERE email=($1) OR phone_number=($1)";
                const result = yield connection.query(sql, [user]);
                connection.release();
                if (result.rowCount > 0) {
                    delete result.rows[0].password;
                    delete result.rows[0].id;
                    return result.rows[0];
                }
                else
                    return null;
            }
            catch (e) {
                console.error('Error in profile function in users.model', e);
                throw e;
            }
        });
    }
    update(user, fullname, email, phone_number, profile_pic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log(fullname);
                const connection = yield index_1.default.connect();
                // if the user wants to change the fullname
                if (fullname) {
                    const sql = "UPDATE users SET fullname=$1 WHERE email=$2 OR phone_number=$2 RETURNING *";
                    const res = (yield connection.query(sql, [fullname, user]));
                    const resFullname = res.rows[0].fullname;
                    const resEmail = res.rows[0].email;
                    const resPhone_number = res.rows[0].phone_number;
                    if (resFullname === fullname)
                        return ({ Message: "Fullname updated successfully", Token: jsonwebtoken_1.default.sign(!resEmail ? resPhone_number : resEmail, config_1.config.secret_key) });
                    else
                        return ({ Message: "Fullname update failed" });
                }
                // if the user wants to change the email
                if (email) {
                    const sql = "UPDATE users SET email=$1 WHERE email=$2 OR phone_number=$2 RETURNING email";
                    const res = (yield connection.query(sql, [email, user])).rows[0].email;
                    if (res === email)
                        return ({ Message: "Email updated successfully", Token: jsonwebtoken_1.default.sign(email, config_1.config.secret_key) });
                    else
                        return ({ Message: "Email update failed" });
                }
                // if the user wants to change the email
                if (phone_number) {
                    const sql = "UPDATE users SET phone_number=$1 WHERE email=$2 OR phone_number=$2 RETURNING phone_number";
                    const res = (yield connection.query(sql, [phone_number, user])).rows[0].phone_number;
                    if (res === phone_number)
                        return ({ Message: "Phone number updated successfully", Token: jsonwebtoken_1.default.sign(phone_number, config_1.config.secret_key) });
                    else
                        return ({ Message: "Phone number update failed" });
                }
                if (profile_pic) {
                    const url = yield (0, storeImages_1.default)([profile_pic], 'Profile Images')[0];
                    const sql = "UPDATE users SET profile_pic=$1 WHERE email=$2 OR phone_number=$2 RETURNING profile_pic";
                    const res = yield connection.query(sql, [url, user]);
                    if (res === url)
                        return ({ Message: "Profile Picture updated successfully", Token: jsonwebtoken_1.default.sign(user, config_1.config.secret_key) });
                    else
                        return ({ Message: "Profile Picture update failed" });
                }
                //returns if no condition was entered
                return ({ Message: "No Data Entered" });
            }
            catch (e) {
                console.log("Error in update function in users.model", e);
                throw e;
            }
        });
    }
    updatePassword(user, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Getting the row associated with the passed email or phone number
                let sql = 'SELECT * FROM users WHERE email=$1 OR phone_number=$1';
                const row = (yield index_1.default.query(sql, [user])).rows[0];
                // Making sure the entered old password is true
                const isPasswordCorrect = bcrypt_1.default.compareSync(oldPassword, row.password);
                if (!isPasswordCorrect)
                    return 'Wrong Password';
                // Hashing the new password and storing it in the database
                const hashedPassword = bcrypt_1.default.hashSync(newPassword, config_1.config.salt);
                sql = 'UPDATE users SET password=$1 WHERE email=$2 OR phone_number=$2 RETURNING password';
                const res = yield index_1.default.query(sql, [hashedPassword, user]);
                const changed = bcrypt_1.default.compareSync(newPassword, res.rows[0].password);
                if (changed)
                    return 'Password Updated Successfully';
                else
                    return 'Password Update Failed';
            }
            catch (e) {
                console.log('Error in updatePassword function in users.model');
                throw e;
            }
        });
    }
}
exports.Users = Users;
;
