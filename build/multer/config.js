"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileStorage = void 0;
const multer_1 = __importDefault(require("multer"));
exports.fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../images/');
    },
    filename: (req, file, cb) => {
        //console.log(file);
        cb(null, Date.now() + '-' + file.originalname);
    }
});
