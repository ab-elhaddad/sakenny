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
class Ads {
    // TODO
    // - return created ads
    create(user, ad) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield index_1.default.connect();
                // Getting user id to for the ad
                const idSQL = 'SELECT id from users WHERE email=$1 or phone_number=$1';
                const id = (yield connection.query(idSQL, [user])).rows[0].id;
                // Inserting the new ad
                const sql = `INSERT INTO ads (user_id, title, space_type, description, price, city, governorate, lat, lng, gender, price_per, email, phone_number, features, terms) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ,$11 ,$12, $13, ($14::bit(20)), ($15::bit(10)) ) RETURNING id`;
                const res = yield connection.query(sql, [id, ad.title, ad.space_type, ad.description, ad.price, ad.city, ad.governorate, ad.lat, ad.lng, ad.gender, ad.price_per, ad.email, ad.phone_number, ad.features, ad.terms]);
                // Inserting images in ad_images
                const ad_id = res.rows[0].id;
                let urlSQL = 'INSERT INTO ad_images (ad_id, url, description) VALUES ';
                let values = []; // To store all the values will be inserted in the query
                let counter = 1; // To count the number of the inserted vriable
                for (let i = 0; ad.images_description && ad.images && i < ad.images.length; i++) {
                    values.push(ad_id, ad.images[i], ad.images_description[i]);
                    // Concatinating the whole query
                    let row = `($${counter++},$${counter++},$${counter++})`;
                    if (i != ad.images.length - 1)
                        row += ',';
                    urlSQL += row;
                }
                console.log(urlSQL);
                console.log(ad.images_description, ad.images);
                // Executing one query to insert all ad images
                if (ad.images && ad.images.length > 0)
                    yield connection.query(urlSQL, values);
                // Checking whether the ad is inserted
                if (res.rowCount === 0)
                    return { Message: 'Ad insertion failed', Flag: false };
                const insertedAd = yield this.get(res.rows[0].id);
                insertedAd.Message = 'Ad inserted successfully';
                connection.release();
                return insertedAd;
            }
            catch (e) {
                console.log('Error in create function in ads.model\n', e);
                throw e;
            }
        });
    }
    search() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield index_1.default.connect();
            const number = 2;
            const num = '110';
            const binaryNumber = number.toString(2);
            console.log(binaryNumber);
            const sql = 'SELECT * FROM ads WHERE  ((features) & (($1)::bit(3)) ) != (0::bit(3))';
            const res = yield connection.query(sql, [num]);
            console.log(res.rows);
            connection.release();
        });
    }
    update(ad_id, ad) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(ad);
                const connection = yield index_1.default.connect();
                let attributesCounter = 2;
                let sql = `UPDATE ads SET `
                    + (ad.new_title ? `title=$${attributesCounter++},` : ``)
                    + (ad.new_space_type ? `space_type=$${attributesCounter++},` : ``)
                    + (ad.new_description ? `description=$${attributesCounter++},` : ``)
                    + (ad.new_price ? `price=$${attributesCounter++},` : ``)
                    + (ad.new_city ? `city=$${attributesCounter++},` : ``)
                    + (ad.new_governorate ? `governorate=$${attributesCounter++},` : ``)
                    + (ad.new_lng ? `lng=$${attributesCounter++},` : ``)
                    + (ad.new_lat ? `lat=$${attributesCounter++},` : ``)
                    + (ad.new_gender != undefined ? `gender=$${attributesCounter++},` : ``)
                    + (ad.new_email ? `email=$${attributesCounter++},` : ``)
                    + (ad.new_phone_number ? `phone_number=$${attributesCounter++},` : ``)
                    + (ad.new_price_per ? `price_per=$${attributesCounter++},` : ``)
                    + (ad.new_features != undefined ? `features=$${attributesCounter++}::bit(20),` : ``)
                    + (ad.new_terms != undefined ? `terms=$${attributesCounter++}::bit(10),` : ``);
                if (sql.endsWith(','))
                    sql = sql.slice(0, sql.length - 1);
                sql += ` WHERE id=$1 `;
                sql += `RETURNING *`;
                console.log(sql);
                let updatedAttributes = [ad_id];
                if (ad.new_title)
                    updatedAttributes.push(ad.new_title);
                if (ad.new_space_type)
                    updatedAttributes.push(ad.new_space_type);
                if (ad.new_description)
                    updatedAttributes.push(ad.new_description);
                if (ad.new_price)
                    updatedAttributes.push(ad.new_price);
                if (ad.new_city)
                    updatedAttributes.push(ad.new_city);
                if (ad.new_governorate)
                    updatedAttributes.push(ad.new_governorate);
                if (ad.new_lng)
                    updatedAttributes.push(ad.new_lng);
                if (ad.new_lat)
                    updatedAttributes.push(ad.new_lat);
                if (ad.new_gender != undefined)
                    updatedAttributes.push(ad.new_gender);
                if (ad.new_email)
                    updatedAttributes.push(ad.new_email);
                if (ad.new_phone_number)
                    updatedAttributes.push(ad.new_phone_number);
                if (ad.new_price_per)
                    updatedAttributes.push(ad.new_price_per);
                if (ad.new_features != undefined)
                    updatedAttributes.push(ad.new_features);
                if (ad.new_terms != undefined)
                    updatedAttributes.push(ad.new_terms);
                console.log(updatedAttributes);
                const res = (yield (connection.query(sql, updatedAttributes))).rows[0];
                return { Message: 'Data updated successfully', ad: res };
            }
            catch (e) {
                console.log('Error in update function in ads.model\n', e);
                return { Message: 'Some error has occured' };
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield index_1.default.connect();
                const sql = 'SELECT * FROM ads';
                const res = yield connection.query(sql);
                // get ads images
                for (const image of res.rows) {
                    const sql = 'SELECT url, description FROM ad_images WHERE ad_id=($1)';
                    image.images = (yield connection.query(sql, [image.id])).rows;
                }
                connection.release();
                return res.rows;
            }
            catch (e) {
                console.log('Error in getAll function in ads.model');
                throw e;
            }
        });
    }
    get(ad_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield index_1.default.connect();
                const sql1 = 'SELECT * FROM ads WHERE id=($1)'; // Ad details
                const sql2 = 'SELECT * FROM ad_images WHERE ad_id=($1)'; // Ad images
                let details = (yield connection.query(sql1, [ad_id]));
                if (details.rowCount === 0)
                    return { Message: "No such ad with the provided id", Flag: false };
                details = details.rows[0];
                const images = (yield connection.query(sql2, [ad_id])).rows;
                //connection.release();
                return { Message: "Ad retrived successfully", Flag: true, ad: Object.assign(Object.assign({}, details), { images }) };
            }
            catch (e) {
                console.log('Error in get function in ads.model\n', e);
                return { Message: "Couldnt retrive data", Flag: false };
            }
        });
    }
    deleteAd(ad_id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield index_1.default.connect();
            const user_id = (yield connection.query('SELECT id FROM users WHERE email=$1 or phone_number=$1', [user])).rows[0].id;
            const sql = 'DELETE FROM ads WHERE id=($1) and user_id=($2)';
            const res = yield connection.query(sql, [ad_id, user_id]);
            connection.release();
            if (res.rowCount === 0)
                return { Message: "No such ad with the provided id", Flag: false };
            else
                return { Message: "Ad deleted successfully", Flag: true };
        });
    }
}
exports.default = Ads;
