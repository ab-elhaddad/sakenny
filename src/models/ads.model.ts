import client from "../database";
import Ad from "../types/Ad.type";

class Ads {
    async create(ad: Ad) {
    }

    async update() {
    }

    async getAll(): Promise<object> {
        try {
            const connection = await client.connect();
            const sql = 'SELECT * FROM ads';
            const res = await connection.query(sql);
            connection.release();
            return res;
        } catch (e) {
            console.log('Error in getAll function in ads.model');
            throw e;
        }
    }
}

export default Ads;