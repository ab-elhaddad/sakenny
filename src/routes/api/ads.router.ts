import express from 'express';
import { create, deleteAd, get, getAll, getByUser, search, update } from '../../controllers/ads.controller';
import authenticate from '../../middlewares/authenticate.middleware';
import { fileStorage } from '../../multer/config';
import multer from 'multer';
import { addImage, deleteImage } from '../../controllers/ad_images.controller';

const upload = multer({ storage: fileStorage });

const adsRouter = (app: express.Application): void => {
    app.get('/ads/get-all', getAll);
    app.post('/ads/create', authenticate, upload.array('images'), create);
    app.post('/ads/search', search);
    app.post('/ads/get', get);
    app.delete('/ads/delete', authenticate, deleteAd);
    app.delete('/ads/delete-image', authenticate, deleteImage);
    app.put('/ads/update', authenticate, update);
    app.post('/ads/add-image', authenticate, upload.array('images'), addImage);
    app.get('/ads/get-by-user', authenticate, getByUser);
}

export default adsRouter;