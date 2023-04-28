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
const database_1 = __importDefault(require("../database"));
const storeImages_1 = __importDefault(require("./functions/storeImages"));
class Ads {
    // NOT TESTED YET
    create(user, imagesPaths, ad) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                // Getting user id to for the ad
                const idSQL = 'SELECT id from users WHERE email=$1 or phone_number=$2';
                const id = yield connection.query(idSQL, [user]);
                // Uploading Images to cloudinairy
                const imagesURLs = yield (0, storeImages_1.default)(imagesPaths, 'Ads Images');
                // Inserting the new ad
                const sql = 'INSERT INTO users (users_id, title,space_type, description, price, city, address, lat, lng, gender, services, pics, price_per) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ,$11 ,$12, $13, $14, $15) RETURNING *';
                const res = yield connection.query(sql, [id, ad.title, ad.space_type, ad.description, ad.price, ad.city, ad.address, ad.lat, ad.lng, ad.gender, ad.services, imagesURLs, ad.price_per]);
                // Checking whether the ad is inserted
                if (res.rowCount === 0)
                    return ('Ad insertion failed');
                return 'Ad inserted successfully';
            }
            catch (e) {
                console.log('Error in create function in ads.model');
                throw e;
            }
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield database_1.default.connect();
                const sql = 'SELECT * FROM ads';
                const res = yield connection.query(sql);
                connection.release();
                return res.rows;
            }
            catch (e) {
                console.log('Error in getAll function in ads.model');
                throw e;
            }
        });
    }
}
exports.default = Ads;
