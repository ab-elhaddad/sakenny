import { PoolClient } from "pg";
import client from "../database/index";
import Ad from "../types/Ad.type";
import { searchedAd } from "../types/serchedAd.type";
import { updatedAd } from "../types/updatedAd.type";

class Ads { // Create - Search - Update - getAll(Home) - getOne
    // return created ads
    async create(user: string, ad: Ad): Promise<any> {
        try {
            const connection = await client.connect();
            // Getting user id to for the ad
            const idSQL = 'SELECT id from users WHERE email=$1 or phone_number=$1';
            const idRes = await connection.query(idSQL, [user]);
            if (idRes.rowCount === 0) return { Message: 'User not found', Flag: false };
            const id = idRes.rows[0].id;

            // Inserting the new ad
            const sql = `INSERT INTO ads (user_id, title, space_type, description, price, city, governorate, lat, lng, gender, price_per, email, phone_number, features, terms) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ,$11 ,$12, $13, ($14::bit(20)), ($15::bit(10)) ) RETURNING id`;
            const res = await connection.query(sql, [id, ad.title, ad.space_type, ad.description, ad.price, ad.city, ad.governorate, ad.lat, ad.lng, ad.gender, ad.price_per, ad.email, ad.phone_number, ad.features, ad.terms]);

            // Inserting images in ad_images
            const ad_id = res.rows[0].id;
            let urlSQL = 'INSERT INTO ad_images (ad_id, url, description) VALUES '
            let values: any = []; // To store all the values will be inserted in the query
            let counter = 1; // To count the number of the inserted vriable
            for (let i = 0; ad.images_description && ad.images && i < ad.images.length; i++) {
                values.push(ad_id, ad.images[i], ad.images_description[i]);
                // Concatinating the whole query
                let row = `($${counter++},$${counter++},$${counter++})`;
                if (i != ad.images.length - 1) row += ',';
                urlSQL += row
            }
            //console.log(urlSQL);
            //console.log(ad.images_description, ad.images);
            // Executing one query to insert all ad images
            if (ad.images && ad.images.length > 0)
                await connection.query(urlSQL, values);

            // Checking whether the ad is inserted
            if (res.rowCount === 0)
                return { Message: 'Ad insertion failed', Flag: false };

            const insertedAd = await this.get(res.rows[0].id);
            insertedAd.Message = 'Ad inserted successfully';
            connection.release();
            return insertedAd;
        }
        catch (e) {
            console.log('Error in create function in ads.model\n', e);
            throw e;
        }
    }

    async search(ad: searchedAd) {
        try {
            const connection = await client.connect();

            const sql = 'SELECT * FROM ads WHERE governorate=$1 AND city=$2 AND space_type=$3 AND price>=$4 AND price<=$5 AND ((features&($6::bit(20)))::integer <> 0) AND ((terms&($7::bit(10)))::integer <> 0)';

            const res = (await connection.query(sql, [ad.governorate, ad.city, ad.space_type, ad.start_price, ad.end_price, ad.features, ad.terms])).rows;

            // Getting images for each ad
            for (const responseAd of res)
                responseAd.images = await this.getImages(responseAd.id, connection);

            connection.release();
            return { Message: 'Ads found', Flag: true, Ads: res };
        } catch (e) {
            console.log('Error in search function in ads.model\n', e);
            return { Message: 'Error in search function in ads.model', Flag: false };
        }
    }

    async simpleSearch(governorate: string, city: string, space_type: string) {
        try {
            const connection = await client.connect();

            const sql = 'SELECT * FROM ads WHERE governorate=$1 AND city=$2 AND space_type=$3 ORDER BY id DESC';

            const res = (await connection.query(sql, [governorate, city, space_type])).rows;

            // Getting images for each ad
            for (const responseAd of res)
                responseAd.images = await this.getImages(responseAd.id, connection);

            connection.release();
            return { Message: 'Ads found', Flag: true, Ads: res };
        }
        catch (e) {
            console.log('Error in simpleSearch function in ads.model\n', e);
            return { Message: 'Something went wrong!', Flag: false };
        }
    }

    async getImages(ad_id: number, connection: PoolClient) {
        try {
            const sql = "SELECT url, description FROM ad_images WHERE ad_id=$1";
            const res = await connection.query(sql, [ad_id]);
            return res.rows;
        }
        catch (e) {
            console.log('Error in getImages function in ads.model\n', e);
            throw e;
        }
    }

    async update(ad_id: number, ad: updatedAd) {
        try {
            //console.log(ad);
            const connection = await client.connect();

            const testAdIdSQL = 'SELECT id FROM ads WHERE id=$1';
            const testAdIdRes = await connection.query(testAdIdSQL, [ad_id]);
            if (testAdIdRes.rowCount === 0) return { Message: 'Ad not found', Flag: false };

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
                + (ad.new_terms != undefined ? `terms=$${attributesCounter++}::bit(10),` : ``)

            if (sql.endsWith(',')) sql = sql.slice(0, sql.length - 1);
            sql += ` WHERE id=$1 `
            sql += `RETURNING *`;

            //console.log(sql);

            let updatedAttributes: any[] = [ad_id];
            if (ad.new_title) updatedAttributes.push(ad.new_title);
            if (ad.new_space_type) updatedAttributes.push(ad.new_space_type);
            if (ad.new_description) updatedAttributes.push(ad.new_description);
            if (ad.new_price) updatedAttributes.push(ad.new_price);
            if (ad.new_city) updatedAttributes.push(ad.new_city);
            if (ad.new_governorate) updatedAttributes.push(ad.new_governorate);
            if (ad.new_lng) updatedAttributes.push(ad.new_lng);
            if (ad.new_lat) updatedAttributes.push(ad.new_lat);
            if (ad.new_gender != undefined) updatedAttributes.push(ad.new_gender);
            if (ad.new_email) updatedAttributes.push(ad.new_email);
            if (ad.new_phone_number) updatedAttributes.push(ad.new_phone_number);
            if (ad.new_price_per) updatedAttributes.push(ad.new_price_per);
            if (ad.new_features != undefined) updatedAttributes.push(ad.new_features);
            if (ad.new_terms != undefined) updatedAttributes.push(ad.new_terms);

            //console.log(updatedAttributes);
            const res = (await (connection.query(sql, updatedAttributes))).rows[0];
            connection.release();
            return { Message: 'Data updated successfully', ad: res };
        }
        catch (e) {
            console.log('Error in update function in ads.model\n', e);
            return { Message: 'Some error has occured' };
        }
    }

    async getAll(): Promise<any> {
        try {
            const connection = await client.connect();
            const sql = 'SELECT * FROM ads ORDER BY id DESC';
            const res = await connection.query(sql);

            // get ads images
            for (const image of res.rows) {
                const sql = 'SELECT url, description FROM ad_images WHERE ad_id=($1)';
                image.images = (await connection.query(sql, [image.id])).rows;
            }

            connection.release();
            return res.rows;
        } catch (e) {
            console.log('Error in getAll function in ads.model');
            throw e;
        }
    }

    async get(ad_id: number): Promise<any> {
        try {
            const connection = await client.connect();
            const sql1 = 'SELECT * FROM ads WHERE id=($1)'; // Ad details
            const sql2 = 'SELECT * FROM ad_images WHERE ad_id=($1)'; // Ad images
            let details = (await connection.query(sql1, [ad_id]));
            if (details.rowCount === 0)
                return { Message: "No such ad with the provided id", Flag: false };

            details = details.rows[0];
            const images = (await connection.query(sql2, [ad_id])).rows;
            //connection.release();
            return { Message: "Ad retrived successfully", Flag: true, ad: { ...details, images } };
        }
        catch (e) {
            console.log('Error in get function in ads.model\n', e);
            return { Message: "Couldnt retrive data", Flag: false };
        }
    }

    async deleteAd(ad_id: number, user: string): Promise<any> {
        const connection = await client.connect();
        let user_id;
        try {
            user_id = (await connection.query('SELECT id FROM users WHERE email=$1 or phone_number=$1', [user])).rows[0].id;
        }
        catch (e) {
            return { Message: "No such user with the provided email or phone number", Flag: false };
        }

        const adImagesSQL = 'DELETE FROM ad_images WHERE ad_id=($1)';
        await connection.query(adImagesSQL, [ad_id]);

        const sql = 'DELETE FROM ads WHERE id=($1) and user_id=($2)';
        const res = await connection.query(sql, [ad_id, user_id]);
        connection.release();

        if (res.rowCount === 0)
            return { Message: "No such ad with the provided id", Flag: false };
        else
            return { Message: "Ad deleted successfully", Flag: true };
    }

    async getByUser(user: string): Promise<any> {
        try {
            const connection = await client.connect();

            const get_id_sql = 'SELECT id FROM users WHERE email=$1 or phone_number=$1';
            const user_id = (await connection.query(get_id_sql, [user])).rows[0].id;

            const sql = 'SELECT * FROM ads WHERE user_id=$1 ORDER BY id DESC';
            const res = await connection.query(sql, [user_id]);

            // get ads images
            for (const ad of res.rows) {
                ad.images = await this.getImages(ad.id, connection);
            }

            connection.release();
            return { Message: "Data retrieved successfully", Ads: res.rows };
        } catch (e) {
            console.log('Error in getByUser function in ads.model');
            return { Message: "Couldnt retrive data", Flag: false };
        }
    }

    // CRUD Operations
    async _create(user_id: number, ad: Ad): Promise<void> {
        try {
            const connection = await client.connect();
            const sql = `INSERT INTO ads (user_id, title, space_type, description, price, city, governorate, lat, lng, gender, price_per, email, phone_number, features, terms) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ,$11 ,$12, $13, ($14::bit(20)), ($15::bit(10)) ) RETURNING id`;
            await connection.query(sql, [user_id, ad.title, ad.space_type, ad.description, ad.price, ad.city, ad.governorate, ad.lat, ad.lng, ad.gender, ad.price_per, ad.email, ad.phone_number, ad.features, ad.terms]);
            connection.release();
        }
        catch (e) {
            console.log('Error in _create function in ads.model\n', e);
            return;
        }
    }

    async _read(): Promise<any> {
        try {
            const connection = await client.connect();
            const sql = `SELECT * FROM ads ORDER BY id DESC`;
            const res = await connection.query(sql);
            connection.release();
            return res.rows;
        }
        catch (e) {
            console.log('Error in _read function in ads.model\n', e);
            return;
        }
    }

    async _update(ad_id: number, ad: updatedAd): Promise<void> {
        try {
            const connection = await client.connect();
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
                + (ad.new_terms != undefined ? `terms=$${attributesCounter++}::bit(10),` : ``)

            if (sql.endsWith(',')) sql = sql.slice(0, sql.length - 1);
            sql += ` WHERE id=$1 `
            sql += `RETURNING *`;

            //console.log(sql);

            let updatedAttributes: any[] = [ad_id];
            // for (const attribute of Object.keys(ad))
            //     if (attribute) updatedAttributes.push(attribute);

            if (ad.new_title) updatedAttributes.push(ad.new_title);
            if (ad.new_space_type) updatedAttributes.push(ad.new_space_type);
            if (ad.new_description) updatedAttributes.push(ad.new_description);
            if (ad.new_price) updatedAttributes.push(ad.new_price);
            if (ad.new_city) updatedAttributes.push(ad.new_city);
            if (ad.new_governorate) updatedAttributes.push(ad.new_governorate);
            if (ad.new_lng) updatedAttributes.push(ad.new_lng);
            if (ad.new_lat) updatedAttributes.push(ad.new_lat);
            if (ad.new_gender != undefined) updatedAttributes.push(ad.new_gender);
            if (ad.new_email) updatedAttributes.push(ad.new_email);
            if (ad.new_phone_number) updatedAttributes.push(ad.new_phone_number);
            if (ad.new_price_per) updatedAttributes.push(ad.new_price_per);
            if (ad.new_features != undefined) updatedAttributes.push(ad.new_features);
            if (ad.new_terms != undefined) updatedAttributes.push(ad.new_terms);

            connection.release();
            await connection.query(sql, updatedAttributes);
        }
        catch (e) {
            console.log('Error in _update function in ads.model\n', e);
            return;
        }
    }

    async _delete(ad_id: number): Promise<void> {
        try {
            const connection = await client.connect();
            const sql = `DELETE FROM ads WHERE id=$1`;
            await connection.query(sql, [ad_id]);
            connection.release();
        }
        catch (e) {
            console.log('Error in _delete function in ads.model\n', e);
            return;
        }
    }
}

export default Ads;