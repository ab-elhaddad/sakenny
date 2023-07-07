import express from 'express';
import { _create, _read, _update, _delete } from '../../controllers/ads.controller';
import { _create_, _read_, _update_, _updateImage_, _delete_ } from '../../controllers/users.controller';
import { _addImage, _deleteImage } from '../../controllers/ad_images.controller';

const dashboardRouter = (app: express.Application): void => {
    // Users Routes
    app.post('/dashboard/users/create', _create_);
    app.get('/dashboard/users/read', _read_);
    app.post('/dashboard/users/update', _update_);
    app.post('/dashboard/users/update-image', _updateImage_);
    app.delete('/dashboard/users/delete', _delete_);
    // Ads Routes
    app.post('/dashboard/ads/create', _create);
    app.get('/dashboard/ads/read', _read);
    app.post('/dashboard/ads/update', _update);
    app.delete('/dashboard/ads/delete', _delete);
    // Ads Images Routes
    app.post('/dashboard/ads/add-image', _addImage);
    app.delete('/dashboard/ads/delete-image', _deleteImage);
}
export default dashboardRouter;