"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const users_router_1 = require("./api/users.router");
const mainRouter = (app) => {
    (0, users_router_1.usersRouter)(app);
};
exports.mainRouter = mainRouter;
