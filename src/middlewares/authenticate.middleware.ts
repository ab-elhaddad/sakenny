import express, { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { config } from '../configuration/config';
import client from '../database/index';

const authenticate = express.Router();

const exists = async (user: string): Promise<boolean> => {
    const connection = await client.connect();
    const sql = "SELECT * FROM users WHERE email=$1 OR phone_number=$1";
    const result = await connection.query(sql, [user]);
    connection.release();

    return result.rowCount > 0;
}

authenticate.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enteredToken = req.headers.authorization as string;

        // Check if the token are attached or not (undefined or has a value)
        if (!enteredToken)
            return res.json({ Message: 'You have to attach a token' }).status(301);
        console.log(enteredToken);

        //const rawToken = enteredToken.substring(enteredToken.indexOf(' ') + 1);
        const rawToken = enteredToken.split(' ')[1];

        res.locals.user = JWT.verify(rawToken, config.secret_key);

        if (! await exists(res.locals.user))
            return res.json({ Message: 'Invalid Token [Old Token]' }).status(403);

        next();
    }
    catch (e) {
        return res.json({ Message: 'Invalid Token' }).status(403);
        //console.log('Error in authenticate middleware', e);
    }
});

export default authenticate;