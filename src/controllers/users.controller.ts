import { User } from "../types/User.type";
import { Users } from "../models/users.model";
import express from 'express';

const users = new Users();

export const register = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const input: User = {
            fullname: req.body.fullname,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: req.body.password,
            profile_pic: req.files ? req.files[0].path : undefined
        };
        console.log(input);
        const result = await users.register(input);

        if (result === "The Email Or Phone Number Already Used") {
            res.json({
                Message: result,
                Flag: false
            }).status(401);
        }
        else {
            res.json({
                Message: 'Registered Successfully',
                Flag: true,
                Token: result
            });
        }
    }
    catch (e) {
        console.error(`Error in register function in users controller`);
        throw (e);
    }
};

export const login = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const result = await users.login(req.body.email, req.body.phone_number, req.body.password);

        if (result === 'Wrong Email Or Phone Number!') {
            res.json({
                Message: result,
                Flag: false,
            }).status(401);
        } else if (result === 'Wrong Password!') {
            res.json({
                Message: result,
                Flag: false
            }).status(403);
        }
        else {
            res.json({
                Message: "Logged in Successfully",
                Flag: true,
                Token: result
            });
        }
    }
    catch (e) {
        console.error(`Error in login function in users controller`);
        throw (e);
    }
};

export const resetPassword = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const result = await users.resetPassword(req.body.email, req.body.phone_number, req.body.new_password);
        if (result === 'Password Reset Failed')
            res.json({ Message: result, Flag: false }).status(401);
        else
            res.json({ Message: result, Flag: true })
    }
    catch (e) {
        console.error('Error in resetPassword function in users.controller');
        throw (e);
    }
}

export const profile = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const result = await users.profile(req.body.email, req.body.phone_number);
        if (!result) {
            res.json({
                Message: 'Wrong email or phone number',
                Flag: false,
            }).status(401);
        }
        else {
            res.json({
                Message: 'Data Retrieved Successfully',
                Flag: true,
                ...result
            });
        }
    }
    catch (e) {
        console.log("Error in profile function in users.controller", e);
    }
}

export const update = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const result = await users.update(res.locals.user, req.body.new_fullname, req.body.new_email, req.body.new_phone_number, req.files ? req.files[0].path : undefined);
        if (!result.Message.includes("successfully")) // Not Successfully
            res.json({ Message: result.Message, Flag: false }).status(403);
        else
            res.json({ ...result, Flag: true });
    }
    catch (e) {
        console.log("Error in update function in users.controller", e);
    }
}

export const updatePassword = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        console.log(res.locals.user, req.body.old_password, req.body.new_password);
        const result = await users.updatePassword(res.locals.user, req.body.old_password, req.body.new_password);
        if (result.includes('Successfully'))
            res.json({ Message: result, Flag: true })
        else
            res.json({ Message: result, Flag: false }).status(403);
    } catch (e) {
        console.log('Error in updatePassword in users.controller');
        throw e;
    }
}