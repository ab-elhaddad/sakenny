import express from 'express';
import { getAll } from '../../controllers/ads.controller';

const adsRouter = (app: express.Application): void => {
    app.get('/ads', getAll);
}

export default adsRouter;