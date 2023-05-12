"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const main_router_1 = require("./routes/main.router");
const multer_1 = __importDefault(require("multer"));
const config_1 = require("./multer/config");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const app = (0, express_1.default)();
const port = 3000 || process.env.PORT;
const address = `0.0.0.0:${port}`;
//app.use(morgan("common"));
// multer middleware to handle form-data requests
// store images in images directory and add text data to rea.body
app.use((0, multer_1.default)({ storage: config_1.fileStorage }).array('images', 5));
// Switch data sent in form-data requests to req.body
// const upload = multer();
// app.use(upload.any(), (req, res, next) => {
//     console.log(req.body); // the form data sent in the request
//     next();
// });
//const swaggerSpec = swaggerJSDoc(options);
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use(body_parser_1.default.json());
(0, main_router_1.mainRouter)(app);
app.get('/', (_req, res) => {
    res.send('Welcome to Sakkeny!');
});
app.use((_req, res) => {
    res.json({ Message: "I'm sorry, There is no such endpoint" });
});
app.listen(port, () => {
    console.log(`starting app on: ${address}`);
});
exports.default = app;
