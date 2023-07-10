"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admins_controller_1 = require("../../controllers/admins.controller");
const adminsRouter = (app) => {
    app.post('/admins/sign-in', admins_controller_1.signIn);
};
exports.default = adminsRouter;
