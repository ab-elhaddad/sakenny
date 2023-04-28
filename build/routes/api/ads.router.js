"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ads_controller_1 = require("../../controllers/ads.controller");
const authenticate_middleware_1 = __importDefault(require("../../middlewares/authenticate.middleware"));
const adsRouter = (app) => {
    app.get('/ads', ads_controller_1.getAll);
    app.post('/ads/create', authenticate_middleware_1.default, ads_controller_1.create);
};
exports.default = adsRouter;
