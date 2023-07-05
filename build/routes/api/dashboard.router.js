"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ads_controller_1 = require("../../controllers/ads.controller");
const dashboardRouter = (app) => {
    // Ads Routes
    app.post('/dashboard/ads/create', ads_controller_1._create);
    app.get('/dashboard/ads/read', ads_controller_1._read);
    app.post('/dashboard/ads/update', ads_controller_1._update);
    app.delete('/dashboard/ads/delete', ads_controller_1._delete);
};
exports.default = dashboardRouter;
