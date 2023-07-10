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
class AdImages {
    constructor() {
        this.deleteImage = (ad_id, image_url, user) => __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield index_1.default.connect();
                // Get user id 
                const sqlToGetUserId = 'SELECT id FROM users WHERE email=$1 or phone_number=$1';
                const user_id = (yield connection.query(sqlToGetUserId, [user])).rows[0].id;
                // Check if the ad belongs to the user
                const sqlCheckAd = 'SELECT * FROM ads WHERE id=($1) and user_id=($2)';
                const check = (yield connection.query(sqlCheckAd, [ad_id, user_id])).rowCount > 0;
                if (!check) {
                    connection.release();
                    return { Message: "No such ad with the provided token id", Flag: false };
                }
                else {
                    const sql = 'DELETE FROM ad_images WHERE ad_id=($1) and url=($2)';
                    const res = yield connection.query(sql, [ad_id, image_url]);
                    connection.release();
                    if (res.rowCount === 0)
                        return { Message: "No such image with the provided url", Flag: false };
                    else
                        return { Message: "Image deleted successfully", Flag: true };
                }
            }
            catch (e) {
                //console.log('Error in deleteImage in ad_images.model\n', e);
                return { Message: "Something went wrong!", Flag: false };
            }
        });
        this.addImage = (ad_id, image_url, image_description) => __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log(ad_id, image_url, image_description);
                const connection = yield index_1.default.connect();
                const sql = 'INSERT INTO ad_images (ad_id, url, description) VALUES ($1, $2, $3) RETURNING *';
                const res = yield connection.query(sql, [ad_id, image_url, image_description]);
                //console.log(res.rows[0]);
                if (res.rowCount > 0)
                    return { Message: "Image added successfully", Flag: true };
                else
                    return { Message: "Something went wrong!", Flag: false };
            }
            catch (e) {
                //console.log('Error in addImage in ad_images.model\n', e);
                return { Message: "Something went wrong!", Flag: false };
            }
        });
        this._deleteImage = (url) => __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield index_1.default.connect();
                const sql = 'DELETE FROM ad_images WHERE url=($1) RETURNING *';
                const ans = yield connection.query(sql, [url]);
                connection.release();
                if (ans.rowCount === 0)
                    return { Flag: false };
                else
                    return { Flag: true };
            }
            catch (e) {
                //console.log('Error in _deleteImage in ad_images.model\n', e);
                return { Flag: false };
            }
        });
    }
}
exports.default = AdImages;
