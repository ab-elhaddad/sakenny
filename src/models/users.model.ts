import client from './../database/index';
import { User } from '../types/User.type';
import bcrypt, { hash } from 'bcrypt';
import { config } from '../configuration/config';
import jwt from 'jsonwebtoken';
import uploadImages from '../controllers/functions/uploadImages';

export class Users {

    async register(input: User): Promise<string> {
        try {
            const connection = (await client.connect()).on('error', (e) => { console.log(e) });

            //Check Whether There exist account with the same email or phone number
            const testSQL = input.email !== undefined ? "SELECT * FROM users WHERE email=$1" : "SELECT * FROM users WHERE phone_number=$1";
            const testRes = await connection.query(testSQL, [input.email !== undefined ? input.email : input.phone_number]);
            if (testRes.rowCount > 0)
                return "The Email Or Phone Number Already Used";

            //Getting hashed password to be stored in db
            const hashedPassword = bcrypt.hashSync(input.password, config.salt);

            //Uploading profile picture to cloudinairy and getting the link
            const url = await uploadImages(input.profile_pic ? [input.profile_pic] : [], 'Profile Images')[0];
            console.log(url)

            const sql = "INSERT INTO users (fullname, email, phone_number, password, profile_pic) VALUES ($1, $2, $3, $4, $5) RETURNING *";

            const res = await connection.query(sql, [input.fullname, input.email, input.phone_number, hashedPassword, url]);
            connection.release();

            //Returning token geerated by email or phone number
            return jwt.sign(res.rows[0].email === null ? res.rows[0].phone_number : res.rows[0].email, config.secret_key);
        }
        catch (e) {
            console.error(`Error in register function in users.model function`);
            throw (e);
        }
    }

    async login(email: string, phone_number: string, plainPassword: string): Promise<string> {
        try {
            const connection = (await client.connect()).on('error', (e) => { console.log(e) });
            let res;
            if (email === undefined) {
                const sql = "SELECT * FROM users WHERE phone_number=($1)";
                res = await connection.query(sql, [phone_number]);
            }
            else {
                const sql = "SELECT * FROM users WHERE email=($1)";
                res = await connection.query(sql, [email]);
            }
            setTimeout(() => { connection.release(); }, 1000);

            if (res.rowCount === 0)
                return 'Wrong Email Or Phone Number!';

            const exists = bcrypt.compareSync(plainPassword, res.rows[0].password);
            if (exists)
                return jwt.sign(email === undefined ? phone_number : email, config.secret_key);
            else
                return 'Wrong Password!';
        }
        catch (e) {
            console.error(`Error in login in Users Model ${e}`);
            throw (e);
        }
    }

    async resetPassword(email: string, phone_number: string, new_password: string): Promise<string> {
        try {
            const connection = (await client.connect()).on('error', (e) => { console.log(e) });
            const newHashedPassword = bcrypt.hashSync(new_password, config.salt);
            let result;
            if (email === undefined) {
                const sql = "UPDATE users SET password = $2 WHERE phone_number=$1 RETURNING password";
                result = await connection.query(sql, [phone_number, newHashedPassword]);
            }
            else {
                const sql = "UPDATE users SET password = $2 WHERE email=$1 RETURNING password";
                result = await connection.query(sql, [email, newHashedPassword]);
            }

            connection.release();
            //console.log(result);
            if (result.rowCount > 0 && result.rows[0].password === newHashedPassword)
                return ('Password Reset Successfully');
            else
                return ('Password Reset Failed');
        }
        catch (e) {
            console.error('Error in resetPassword function in users.model');
            throw (e);
        }
    }

    async profile(user: string): Promise<User | null> {
        try {
            const connection = (await client.connect())

            const sql = "SELECT * FROM users WHERE email=($1) OR phone_number=($1)";
            const result = await connection.query(sql, [user]);
            connection.release();

            if (result.rowCount > 0) {
                delete result.rows[0].password;
                delete result.rows[0].id;
                return result.rows[0];
            }
            else
                return null;
        }
        catch (e) {
            console.error('Error in profile function in users.model', e);
            throw e;
        }
    }

    async update(user: string, fullname?: string, email?: string, phone_number?: string, profile_pic?: string) {
        try {
            //console.log(fullname);
            const connection = await client.connect();

            // if the user wants to change the fullname
            if (fullname) {
                const sql = "UPDATE users SET fullname=$1 WHERE email=$2 OR phone_number=$2 RETURNING *";
                const res = (await connection.query(sql, [fullname, user]));

                const resFullname = res.rows[0].fullname as string;
                const resEmail = res.rows[0].email as string;
                const resPhone_number = res.rows[0].phone_number as string;

                if (resFullname === fullname)
                    return ({ Message: "Fullname updated successfully", Token: jwt.sign(!resEmail ? resPhone_number as string : resEmail, config.secret_key) });
                else
                    return ({ Message: "Fullname update failed" });
            }

            // if the user wants to change the email
            if (email) {
                const sql = "UPDATE users SET email=$1 WHERE email=$2 OR phone_number=$2 RETURNING email";
                const res = (await connection.query(sql, [email, user])).rows[0].email;
                if (res === email)
                    return ({ Message: "Email updated successfully", Token: jwt.sign(email as string, config.secret_key) });
                else
                    return ({ Message: "Email update failed" });
            }

            // if the user wants to change the email
            if (phone_number) {
                const sql = "UPDATE users SET phone_number=$1 WHERE email=$2 OR phone_number=$2 RETURNING phone_number";
                const res = (await connection.query(sql, [phone_number, user])).rows[0].phone_number;
                if (res === phone_number)
                    return ({ Message: "Phone number updated successfully", Token: jwt.sign(phone_number as string, config.secret_key) });
                else
                    return ({ Message: "Phone number update failed" });
            }

            if (profile_pic) {
                const sql = "UPDATE users SET profile_pic=$1 WHERE email=$2 OR phone_number=$2 RETURNING profile_pic";
                const res = await connection.query(sql, [profile_pic, user]);

                if (res.rows[0].profile_pic === profile_pic)
                    return ({ Message: "Profile Picture updated successfully", Token: jwt.sign(user, config.secret_key) });
                else
                    return ({ Message: "Profile Picture update failed" });
            }

            //returns if no condition was entered
            return ({ Message: "No Data Entered" });
        }
        catch (e) {
            console.log("Error in update function in users.model", e);
            throw e;
        }
    }

    async updatePassword(user: string, oldPassword: string, newPassword: string): Promise<string> {
        try {
            // Getting the row associated with the passed email or phone number
            let sql = 'SELECT * FROM users WHERE email=$1 OR phone_number=$1';
            const row = (await client.query(sql, [user])).rows[0];

            // Making sure the entered old password is true
            const isPasswordCorrect = bcrypt.compareSync(oldPassword, row.password);
            if (!isPasswordCorrect)
                return 'Wrong Password';

            // Hashing the new password and storing it in the database
            const hashedPassword = bcrypt.hashSync(newPassword, config.salt);
            sql = 'UPDATE users SET password=$1 WHERE email=$2 OR phone_number=$2 RETURNING password';
            const res = await client.query(sql, [hashedPassword, user]);

            const changed = bcrypt.compareSync(newPassword, res.rows[0].password);
            if (changed)
                return 'Password Updated Successfully';
            else
                return 'Password Update Failed';
        } catch (e) {
            console.log('Error in updatePassword function in users.model');
            throw e;
        }
    }

    // CRUD Operations
    async _create(user: User): Promise<void> {
        try {
            const connection = await client.connect();
            const sql = "INSERT INTO users (fullname, email, phone_number, password) VALUES ($1, $2, $3, $4)";
            await connection.query(sql, [user.fullname, user.email, user.phone_number, user.password]);
        }
        catch (e) {
            console.log('Error in _create function in users.model\n', e);
            return;
        }
    }

    async _read(): Promise<any> {
        try {
            const connection = await client.connect();
            const sql = "SELECT * FROM users ORDER BY id ASC";
            const res = await connection.query(sql);
            return res.rows;
        }
        catch (e) {
            console.log('Error in _read function in users.model\n', e);
            return;
        }
    }

    async _update(user: User): Promise<void> {
        // All data is required however it is not required to change all data
        try {
            const connection = await client.connect();
            const sql = "UPDATE users SET fullname=$1, email=$2, phone_number=$3, password=$4 WHERE id=$5";
            await connection.query(sql, [user.fullname, user.email, user.phone_number, user.password, user.id]);
        }
        catch (e) {
            console.log('Error in _update function in users.model\n', e);
            return;
        }
    }

    async _updatePicture(id: number, url: string): Promise<void> {
        try {
            const connection = await client.connect();
            const sql = "UPDATE users SET profile_pic=$1 WHERE id=$2";
            await connection.query(sql, [url, id]);
        }
        catch (e) {
            console.log('Error in _updatePicture function in users.model\n', e);
            return;
        }
    }

    async _delete(id: number): Promise<void> {
        try {
            const connection = await client.connect();
            const sql = "DELETE FROM users WHERE id=$1";
            await connection.query(sql, [id]);
        }
        catch (e) {
            console.log('Error in _delete function in users.model\n', e);
            return;
        }
    }
};