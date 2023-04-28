"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const config_1 = require("../configuration/config");
const cloudinary = cloudinary_1.default.v2;
// Configuration 
cloudinary.config({
    cloud_name: config_1.config.cloudinairy_cloud_name,
    api_key: config_1.config.cloudinairy_api_key,
    api_secret: config_1.config.cloudinairy_api_secret
});
// Export
exports.default = cloudinary;
// Upload
// const res = cloudinary.uploader.upload('../../imgs/2023-03.gif', { public_id: "olympic_flag" })
// res.then((data) => {
//     console.log(data);
//     console.log(data.secure_url);
// }).catch((err) => {
//     console.log(err);
// });
// Generate
// const url = cloudinary.url("olympic_flag", {
//     Crop: 'fill'
// });
// The output url
// console.log(url);
