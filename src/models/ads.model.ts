import client from "../database";
import Ad from "../types/Ad.type";
import storeImages from "./functions/storeImages";

class Ads {
    // NOT TESTED YET
    async create(user: string, imagesPaths: string[], ad: Ad): Promise<string> {
        try {
            const connection = await client.connect();
            // Getting user id to for the ad
            const idSQL = 'SELECT id from users WHERE email=$1 or phone_number=$2';
            const id = await connection.query(idSQL, [user]);

            // Uploading Images to cloudinairy
            const imagesURLs = await storeImages(imagesPaths, 'Ads Images');

            // Inserting the new ad
            const sql = 'INSERT INTO users (users_id, title,space_type, description, price, city, address, lat, lng, gender, services, pics, price_per) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ,$11 ,$12, $13, $14, $15) RETURNING *';
            const res = await connection.query(sql, [id, ad.title, ad.space_type, ad.description, ad.price, ad.city, ad.address, ad.lat, ad.lng, ad.gender, ad.services, imagesURLs, ad.price_per]);

            // Checking whether the ad is inserted
            if (res.rowCount === 0)
                return ('Ad insertion failed');

            return 'Ad inserted successfully';
        }
        catch (e) {
            console.log('Error in create function in ads.model');
            throw e;
        }
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