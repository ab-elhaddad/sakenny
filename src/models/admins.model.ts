import client from "../database/index";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { config } from "../configuration/config";

class Admins {
    signUp = async (username, password): Promise<string | null> => {
        try {
            const connection = await client.connect();

            // Check if the username is already taken
            const test_sql = 'SELECT * FROM admins WHERE username=($1)';
            const res = await connection.query(test_sql, [username]);
            if (res.rows.length > 0)
                return null;

            const sql = 'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING *';
            const encryptedPassword = bcrypt.hashSync(password, config.salt);
            const result = await connection.query(sql, [username, encryptedPassword]);

            const token = JWT.sign(result.rows[0].username, config.secret_key);
            connection.release();
            return token;
        }
        catch (e) {
            console.log('Error in signUp function in admins.model\n', e);
            return null;
        }
    }
    signIn = async (username, password): Promise<string | null> => {
        try {
            const connection = await client.connect();
            const sql = 'SELECT * FROM admins WHERE username=($1)';
            const res = await connection.query(sql, [username]);
            const encryptedPassword = res.rows[0].password;
            const isRightPassword = bcrypt.compareSync(password, encryptedPassword);

            connection.release();
            if (isRightPassword)
                return String(JWT.decode(username));
            else
                return null;
        }
        catch (e) {
            console.log('Error in signIn function in admins.model\n', e);
            return null;
        }
    }
}

export default Admins;