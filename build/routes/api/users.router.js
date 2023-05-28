"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const users_controller_1 = require("../../controllers/users.controller");
const authenticate_middleware_1 = __importDefault(require("../../middlewares/authenticate.middleware"));
const multer_1 = __importDefault(require("multer"));
const config_1 = require("../../multer/config");
const upload = (0, multer_1.default)({ storage: config_1.fileStorage });
const usersRouter = (app) => {
    app.post('/users/register', upload.array('images'), users_controller_1.register);
    app.post('/users/login', users_controller_1.login);
    app.put('/users/reset-password', users_controller_1.resetPassword);
    app.get('/users/profile', authenticate_middleware_1.default, users_controller_1.profile);
    app.put('/users/update', authenticate_middleware_1.default, upload.array('images'), users_controller_1.update);
    app.put('/users/update-password', authenticate_middleware_1.default, users_controller_1.updatePassword);
};
exports.usersRouter = usersRouter;
