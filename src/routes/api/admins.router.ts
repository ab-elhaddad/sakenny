import express from 'express';
import { signIn } from '../../controllers/admins.controller';

const adminsRouter = (app: express.Application): void => {
    app.post('/admins/sign-in', signIn);
}

export default adminsRouter;