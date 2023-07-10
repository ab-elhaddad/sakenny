import express from 'express';
import { signIn, signUp } from '../../controllers/admins.controller';

const adminsRouter = (app: express.Application): void => {
    app.post('/admins/sign-up', signUp);
    app.post('/admins/sign-in', signIn);
}

export default adminsRouter;