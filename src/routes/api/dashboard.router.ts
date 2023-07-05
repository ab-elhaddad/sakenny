import express from 'express';
import { _create, _read, _update, _delete } from '../../controllers/ads.controller';

const dashboardRouter = (app: express.Application): void => {
    // Ads Routes
    app.post('/dashboard/ads/create', _create);
    app.get('/dashboard/ads/read', _read);
    app.post('/dashboard/ads/update', _update);
    app.delete('/dashboard/ads/delete', _delete);
}
export default dashboardRouter;