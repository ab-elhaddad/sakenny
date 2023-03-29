import express from 'express';
import { register, login, profile, resetPassword, update } from '../../controllers/users.controller';
import authenticate from '../../middlewares/authenticate.middleware';

export const usersRouter = (app: express.Application): void => {
    app.post('/users/register', register);
    app.get('/users/login', login);
    app.put('/users/reset-password', resetPassword);
    app.get('/users/profile', profile);
    app.get('/users/update', authenticate, update)
}