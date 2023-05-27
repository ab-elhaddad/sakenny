import express from 'express';
import { register, login, profile, resetPassword, update, updatePassword } from '../../controllers/users.controller';
import authenticate from '../../middlewares/authenticate.middleware';
import multer from 'multer';
import { fileStorage } from '../../multer/config';

const upload = multer({ storage: fileStorage });

export const usersRouter = (app: express.Application): void => {
    app.post('/users/register', upload.array('images'), register);
    app.post('/users/login', login);
    app.put('/users/reset-password', resetPassword);
    app.get('/users/profile', authenticate, profile);
    app.put('/users/update', authenticate, upload.array('images'), update);
    app.put('/users/update-password', authenticate, updatePassword);
}