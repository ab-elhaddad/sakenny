"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ads_controller_1 = require("../../controllers/ads.controller");
const users_controller_1 = require("../../controllers/users.controller");
const ad_images_controller_1 = require("../../controllers/ad_images.controller");
const multer_1 = __importDefault(require("multer"));
const config_1 = require("../../multer/config");
const upload = (0, multer_1.default)({ storage: config_1.fileStorage });
const dashboardRouter = (app) => {
    // Users Routes
    app.post('/dashboard/users/create', users_controller_1._create_);
    app.get('/dashboard/users/read', users_controller_1._read_);
    app.post('/dashboard/users/update', users_controller_1._update_);
    app.post('/dashboard/users/update-password', users_controller_1._update_password_);
    app.post('/dashboard/users/update-image', upload.array('images'), users_controller_1._updateImage_);
    app.delete('/dashboard/users/delete', users_controller_1._delete_);
    // Ads Routes
    app.post('/dashboard/ads/create', upload.array('images'), ads_controller_1._create);
    app.get('/dashboard/ads/read', ads_controller_1._read);
    app.post('/dashboard/ads/update', ads_controller_1._update);
    app.delete('/dashboard/ads/delete', ads_controller_1._delete);
    // Ads Images Routes
    app.post('/dashboard/ads/add-image', upload.array('images'), ad_images_controller_1._addImage);
    app.delete('/dashboard/ads/delete-image', ad_images_controller_1._deleteImage);
};
exports.default = dashboardRouter;
