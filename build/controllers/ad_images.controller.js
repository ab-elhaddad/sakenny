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
exports._deleteImage = exports._addImage = exports.addImage = exports.deleteImage = void 0;
const ad_images_model_1 = __importDefault(require("../models/ad_images.model"));
const uploadImages_1 = __importDefault(require("./functions/uploadImages"));
const adImages = new ad_images_model_1.default();
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adImages.deleteImage(req.body.ad_id, req.body.image_url, res.locals.user);
    if (result.Message.includes('successfully'))
        return res.json(result);
    else
        return res.json(result).status(301);
});
exports.deleteImage = deleteImage;
const addImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = (yield (0, uploadImages_1.default)(req.files, 'Ads Images'))[0];
        const result = yield adImages.addImage(req.body.ad_id, url, req.body.image_description);
        if (result.Message.includes('successfully'))
            return res.json(result);
        else
            return res.json(result).status(401);
    }
    catch (e) {
        console.log('Error in add mage in ad_images.controller\n', e);
        return res.json({ Message: "Something went wrong!" });
    }
});
exports.addImage = addImage;
const _addImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = (yield (0, uploadImages_1.default)(req.files, 'Ads Images'))[0];
        const result = yield adImages.addImage(req.body.ad_id, url, req.body.description);
        if (result.Flag)
            return res.json(result);
        else
            return res.json(result).status(401);
    }
    catch (e) {
        console.log('Error in _addImage in ad_images.controller\n', e);
        return res.json({ Flag: false });
    }
});
exports._addImage = _addImage;
const _deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield adImages._deleteImage(req.body.url);
        if (result.Flag)
            return res.json(result);
        else
            return res.json(result).status(401);
    }
    catch (e) {
        console.log('Error in _deleteImage in ad_images.controller\n', e);
        return res.json({ Flag: false });
    }
});
exports._deleteImage = _deleteImage;
