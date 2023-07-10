"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const users_router_1 = require("./api/users.router");
const ads_router_1 = __importDefault(require("./api/ads.router"));
const dashboard_router_1 = __importDefault(require("./api/dashboard.router"));
const admins_router_1 = __importDefault(require("./api/admins.router"));
const mainRouter = (app) => {
    (0, users_router_1.usersRouter)(app);
    (0, ads_router_1.default)(app);
    (0, dashboard_router_1.default)(app);
    (0, admins_router_1.default)(app);
};
exports.mainRouter = mainRouter;
