import Admins from "../models/admins.model";
import express from 'express';

const admins = new Admins();

export const signUp = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        const token = await admins.signUp(username, password);
        if (token)
            res.json({ Flag: true, Token: token });
        else
            res.json({ Flag: false }).status(401);
    }
    catch (e) {
        console.log('Error in signUp function in admins\n', e);
        res.json({ Flag: false }).status(401);
    }
}

export const signIn = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        const token = await admins.signIn(username, password);
        if (token)
            res.json({ Flag: true, Token: token });
        else
            res.json({ Flag: false }).status(401);
    }
    catch (e) {
        console.log('Error in signIn function in admins\n', e);
    }
}