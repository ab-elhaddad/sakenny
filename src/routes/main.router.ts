import express from "express";
import { usersRouter } from "./api/users.router";
import adsRouter from "./api/ads.router";
import dashboardRouter from "./api/dashboard.router";

export const mainRouter = (app: express.Application) => {
    usersRouter(app);
    adsRouter(app);
    dashboardRouter(app);
}