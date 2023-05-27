import client from "../database";
import Ad from "../types/Ad.type";
import storeImages from "../controllers/functions/uploadImages";

class Ads {
    // TODO
    // - return desired ads
    async create(user: string, ad: Ad): Promise<string> {
        try {
            const connection = await client.connect();
            // Getting user id to for the ad
            const idSQL = 'SELECT id from users WHERE email=$1 or phone_number=$1';
            const id = (await connection.query(idSQL, [user])).rows[0].id;

            // Inserting the new ad
            const sql = 'INSERT INTO ads (user_id, title, space_type, description, price, city, governorate, lat, lng, gender, price_per, email, phone_number, features, terms) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ,$11 ,$12, $13, ($14::bit(3)), ($15::bit(3))) RETURNING *';
            const res = await connection.query(sql, [id, ad.title, ad.space_type, ad.description, ad.price, ad.city, ad.governorate, ad.lat, ad.lng, ad.gender, ad.price_per, ad.email, ad.phone_number, ad.features, ad.terms]);

            // Inserting images in ad_images and getting the inserted rows
            const ad_id = res.rows[0].id;
            let imagesRes: any[] = [];
            for (let i = 0; ad.images && i < ad.images.length; i++) {
                const url: string = ad.images ? ad.images[i] : "";
                const description = ad.images_description ? ad.images_description[i] : "";
                const sql = 'INSERT INTO ad_images (ad_id, url, description) VALUES ($1, $2, $3) RETURNING *'
                const res = await connection.query(sql, [ad_id, url, description]);
                imagesRes.push(res);
            }

            connection.release();

            // Checking whether the ad is inserted
            if (res.rowCount === 0)
                return 'Ad insertion failed';

            return 'Ad inserted successfully';
        }
        catch (e) {
            console.log('Error in create function in ads.model\n');
            throw e;
        }
    }

    async search() {
        const connection = await client.connect();
        const number = 2;
        const num = '110';
        const binaryNumber = number.toString(2);
        console.log(binaryNumber);
        const sql = 'SELECT * FROM ads WHERE  ((features) & (($1)::bit(3)) ) != (0::bit(3))';
        const res = await connection.query(sql, [num]);
        console.log(res.rows);
        connection.release();
    }

    async update() {
    }

    async getAll(): Promise<object> {
        try {
            const connection = await client.connect();
            const sql = 'SELECT * FROM ads';
            const res = await connection.query(sql);
            connection.release();
            return res.rows;
        } catch (e) {
            console.log('Error in getAll function in ads.model');
            throw e;
        }
    }
}

export default Ads;