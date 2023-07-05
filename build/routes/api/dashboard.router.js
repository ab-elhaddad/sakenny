"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ads_controller_1 = require("../../controllers/ads.controller");
const users_controller_1 = require("../../controllers/users.controller");
const dashboardRouter = (app) => {
    // Users Routes
    app.post('/dashboard/users/create', users_controller_1._create_);
    app.get('/dashboard/users/read', users_controller_1._read_);
    app.post('/dashboard/users/update', users_controller_1._update_);
    app.post('/dashboard/users/update-image', users_controller_1._updateImage_);
    app.delete('/dashboard/users/delete', users_controller_1._delete_);
    // Ads Routes
    app.post('/dashboard/ads/create', ads_controller_1._create);
    app.get('/dashboard/ads/read', ads_controller_1._read);
    app.post('/dashboard/ads/update', ads_controller_1._update);
    app.delete('/dashboard/ads/delete', ads_controller_1._delete);
};
exports.default = dashboardRouter;
