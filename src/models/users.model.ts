import client from './../database/index';
import { User } from '../types/User.type';
import bcrypt from 'bcrypt';
import { config } from '../configuration/config';
import jwt from 'jsonwebtoken';
import storeImages from './storeImages';

export class Users {

    async register(input: User): Promise<string> {
        try {
            const connection = (await client.connect()).on('error', (e) => { console.log(e) });

            //Check Whether There exist account with the same email or phone number
            const testSQL = input.email !== undefined ? "SELECT * FROM users WHERE email=$1" : "SELECT * FROM users WHERE phone_number=$1";
            const testRes = await connection.query(testSQL, [input.email !== undefined ? input.email : input.phone_number]);
            if (testRes.rowCount > 0)
                return "The Email Or Phone Number Already Used";

            //Uploading profile picture to cloudinairy and getting the link
            let url: string | undefined;
            if (input.profile_pic)
                url = await storeImages([input.profile_pic], 'Profile Images')[0];

            const sql = "INSERT INTO users (fullname, email, phone_number, password, profile_pic) VALUES ($1, $2, $3, $4, $5) RETURNING *";

            //Getting hashed password to be stored in db
            const hashedPassword = bcrypt.hashSync(input.password, config.salt);

            const res = await connection.query(sql, [input.fullname, input.email, input.phone_number, hashedPassword, url]);
            connection.release();

            //Returning token geerated by email or phone number
            return jwt.sign(res.rows[0].email === null ? res.rows[0].phone_number : res.rows[0].email, config.secret_key);
        }
        catch (e) {
            console.error(`Error in Register function in users.model function`);
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
            console.log(result);
            if (result.rows[0].password === newHashedPassword)
                return ('Password Reset Successfully');
            else
                return ('Password Reset Failed');
        }
        catch (e) {
            console.error('Error in resetPassword function in users.model');
            throw (e);
        }
    }

    async profile(email: string, phone_number: string): Promise<User | null> {
        try {
            const connection = (await client.connect())

            let result;
            if (phone_number) {
                const sql = 'SELECT * FROM users WHERE phone_number=$1';
                result = await connection.query(sql, [phone_number]);
            }
            else {
                const sql = 'SELECT * FROM users WHERE email=$1';
                result = await connection.query(sql, [email]);
            }
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
                const url = await storeImages([profile_pic], 'Profile Images')[0];
                const sql = "UPDATE users SET profile_pic=$1 WHERE email=$2 OR phone_number=$2 RETURNING profile_pic";
                const res = await connection.query(sql, [url, user]);
                if (res === url)
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
};