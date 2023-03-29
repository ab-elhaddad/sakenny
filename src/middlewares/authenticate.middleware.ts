import express, { Request, Response, NextFunction, Router } from 'express';
import JWT from 'jsonwebtoken';
import { config } from '../configuration/config';
import { client } from '../database';

const authenticate = express.Router();

const exists = async (user: string): Promise<boolean> => {
    const connection = await client.connect();
    const sql = "SELECT * FROM users WHERE email=$1 OR phone_number=$1";
    const result = await connection.query(sql, [user]);

    return result.rowCount > 0;
}

authenticate.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enteredToken = req.headers.authorization as string;
        //const rawToken = enteredToken.substring(enteredToken.indexOf(' ') + 1);
        const rawToken = enteredToken.split(' ')[1];

        res.locals.user = JWT.verify(rawToken, config.secret_key);

        if (! await exists(res.locals.user))
            res.json({ Message: 'Invalid Token [Old Token]' }).status(403);

        next();
    }
    catch (e) {
        res.json({ Message: 'Invalid Token' }).status(403);
    }
});

export default authenticate;