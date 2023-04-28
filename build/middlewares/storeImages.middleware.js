"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../cloudinairy/config"));
const fs_1 = __importDefault(require("fs"));
const storeImagesMW = express_1.default.Router();
storeImagesMW.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
}));
const storeImages = (images, folder) => __awaiter(void 0, void 0, void 0, function* () {
    let urls = [];
    images.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            folder: folder,
            transformation: [
                { width: 1000, crop: "scale" },
                { quality: "auto" },
                { fetch_format: "auto" }
            ]
        };
        const res = yield config_1.default.uploader.upload(image, options);
        fs_1.default.rmSync(image);
        console.log(res);
        urls.push(res.secure_url);
    }));
    return urls;
});
exports.default = storeImages;
