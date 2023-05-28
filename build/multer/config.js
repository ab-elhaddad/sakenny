"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileStorage = void 0;
const config_1 = require("../configuration/config");
const multer_1 = __importDefault(require("multer"));
exports.fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (config_1.config.ENV === 'dev' || config_1.config.ENV === 'test')
            cb(null, 'src/images/');
        else
            cb(null, 'images/');
    },
    filename: (_req, file, cb) => {
        //console.log(file);
        cb(null, Date.now() + '-' + file.originalname);
    }
});
