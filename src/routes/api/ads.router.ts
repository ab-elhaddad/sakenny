import express from 'express';
import { create, getAll } from '../../controllers/ads.controller';
import authenticate from '../../middlewares/authenticate.middleware';

const adsRouter = (app: express.Application): void => {
    app.get('/ads', getAll);
    app.post('/ads/create', authenticate, create);
}

export default adsRouter;