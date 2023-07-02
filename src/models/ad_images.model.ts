import client from "../database/index";

class AdImages {
    deleteImage = async (ad_id: number, image_url: string, user: string) => {
        const connection = await client.connect();

        // Get user id 
        const sqlToGetUserId = 'SELECT id FROM users WHERE email=$1 or phone_number=$1';
        const user_id = (await connection.query(sqlToGetUserId, [user])).rows[0].id;

        // Check if the ad belongs to the user
        const sqlCheckAd = 'SELECT * FROM ads WHERE id=($1) and user_id=($2)';
        const check: boolean = (await connection.query(sqlCheckAd, [ad_id, user_id])).rowCount > 0;

        if (!check) {
            connection.release();
            return { Message: "No such ad with the provided token id", Flag: false };
        }
        else {
            const sql = 'DELETE FROM ad_images WHERE ad_id=($1) and url=($2)';
            const res = await connection.query(sql, [ad_id, image_url]);
            connection.release();

            if (res.rowCount === 0)
                return { Message: "No such image with the provided url", Flag: false };
            else
                return { Message: "Image deleted successfully", Flag: true };
        }
    }

    addImage = async (ad_id: number, image_url: string, image_description: string) => {
        try {
            console.log(ad_id, image_url, image_description);
            const connection = await client.connect();
            const sql = 'INSERT INTO ad_images (ad_id, url, description) VALUES ($1, $2, $3) RETURNING *'
            const res = await connection.query(sql, [ad_id, image_url, image_description]);
            console.log(res.rows[0]);
            if (res.rowCount > 0)
                return { Message: "Image added successfully" };
            else
                return { Message: "Something went wrong!" };
        }
        catch (e) {
            console.log('Error in addImage in ad_images.model\n', e);
            return { Message: "Something went wrong!" };
        }
    }
}

export default AdImages;