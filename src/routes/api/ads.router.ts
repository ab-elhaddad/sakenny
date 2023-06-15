import express from 'express';
import { create, deleteAd, get, getAll, search } from '../../controllers/ads.controller';
import authenticate from '../../middlewares/authenticate.middleware';
import { fileStorage } from '../../multer/config';
import multer from 'multer';

const upload = multer({ storage: fileStorage });

const adsRouter = (app: express.Application): void => {
    app.get('/ads/get-all', getAll);
    app.post('/ads/create', authenticate, upload.array('images'), create);
    app.post('/ads/search', search);
    app.post('/ads/get', get);
    app.delete('/ads/delete', authenticate, deleteAd);
}

export default adsRouter;