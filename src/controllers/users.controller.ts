import { User } from "../types/User.type";
import { Users } from "../models/users.model";
import express from 'express';
import uploadImages from "./functions/uploadImages";
import bcrypt from 'bcrypt';
import { config } from "../configuration/config";

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
        //console.log(input);
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
        const result = await users.profile(res.locals.user);
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
        // Check whether the desired update in profile pic to upload it
        let profile_pic: any;
        if (req.files) profile_pic = (await uploadImages(req.files, 'Profile Images'))[0];

        const result = await users.update(res.locals.user, req.body.new_fullname, req.body.new_email, req.body.new_phone_number, profile_pic);

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

// CRUD Operations
export const _create_ = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const inputUser: User = {
            fullname: req.body.fullname,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: bcrypt.hashSync(req.body.password, config.salt)
        };
        await users._create(inputUser);
        res.json({ Message: 'User Created Successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _create function in users.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false }).status(500);
    }
}

export const _read_ = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const result = await users._read();
        res.json({ Message: 'Data Retrieved Successfully', Flag: true, Users: result });
    }
    catch (e) {
        console.log('Error in _read function in users.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false }).status(500);
    }
}

export const _update_ = async (req: express.Request, res: express.Response): Promise<void> => {
    // All data is required however it is not required to change all data
    try {
        const inputUser: User = {
            id: req.body.id,
            fullname: req.body.fullname,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: bcrypt.hashSync(req.body.password, config.salt)
        };
        await users._update(inputUser);
        res.json({ Message: 'User Updated Successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _update function in users.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false }).status(500);
    }
}

export const _updateImage_ = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const url = (await uploadImages(req.files, 'Profile Images'))[0];
        await users._updatePicture(req.body.id, url);
        res.json({ Message: `User's image Updated Successfully`, Flag: true });
    }
    catch (e) {
        console.log('Error in _updateImage function in users.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false }).status(500);
    }
}

export const _delete_ = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        await users._delete(req.body.id);
        res.json({ Message: 'User Deleted Successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _delete function in users.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false }).status(500);
    }
}