import express from 'express';
import { register, login, profile, resetPassword, update, updatePassword } from '../../controllers/users.controller';
import authenticate from '../../middlewares/authenticate.middleware';

export const usersRouter = (app: express.Application): void => {
    app.post('/users/register', register);
    app.post('/users/login', login);
    app.put('/users/reset-password', resetPassword);
    app.post('/users/profile', profile);
    app.put('/users/update', authenticate, update);
    app.put('/users/update-password', authenticate, updatePassword);
}