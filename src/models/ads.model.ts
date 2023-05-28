import client from "../database/index";
import Ad from "../types/Ad.type";

class Ads { // Create - Search - Update - getAll(Home) - getOne
    // TODO
    // - return created ads
    async create(user: string, ad: Ad): Promise<any> {
        try {
            const connection = await client.connect();
            // Getting user id to for the ad
            const idSQL = 'SELECT id from users WHERE email=$1 or phone_number=$1';
            const id = (await connection.query(idSQL, [user])).rows[0].id;

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
            console.log('Before getting images urls');
            // Executing one query to insert all ad images
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
            connection.release();
            return { Message: "Ad retrived successfully", Flag: true, ad: { ...details, images } };
        }
        catch (e) {
            console.log('Error in get function in ads.model\n', e);
            return { Message: "Couldnt retrive data", Flag: false };
        }
    }
}

export default Ads;