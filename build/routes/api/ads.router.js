"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ads_controller_1 = require("../../controllers/ads.controller");
const authenticate_middleware_1 = __importDefault(require("../../middlewares/authenticate.middleware"));
const config_1 = require("../../multer/config");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: config_1.fileStorage });
const adsRouter = (app) => {
    app.get('/ads', ads_controller_1.getAll);
    app.post('/ads/create', authenticate_middleware_1.default, upload.array('images'), ads_controller_1.create);
    app.post('/ads/search', ads_controller_1.search);
    app.post('/ads/get', ads_controller_1.get);
};
exports.default = adsRouter;
