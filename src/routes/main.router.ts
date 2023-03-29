import express from "express";
import { usersRouter } from "./api/users.router";

export const mainRouter = (app: express.Application) => {
    usersRouter(app);
}