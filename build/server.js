"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const main_router_1 = require("./routes/main.router");
//import config from './configuration/config';
const app = (0, express_1.default)();
const port = 3000;
const address = `0.0.0.0:${port}`;
app.use(body_parser_1.default.json());
(0, main_router_1.mainRouter)(app);
app.get('/', (_req, res) => {
    res.send('Hello Sakkeny!');
});
app.listen(port, () => {
    console.log(`starting app on: ${address}`);
});
exports.default = app;
