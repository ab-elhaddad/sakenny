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
exports.deleteAd = exports.search = exports.get = exports.getAll = exports.create = void 0;
const ads_model_1 = __importDefault(require("../models/ads.model"));
const encryptFeatures_1 = __importDefault(require("./functions/encryptFeatures"));
const uploadImages_1 = __importDefault(require("./functions/uploadImages"));
const encryptTerms_1 = __importDefault(require("./functions/encryptTerms"));
const decryptFeatures_1 = __importDefault(require("./functions/decryptFeatures"));
const decryptTerms_1 = __importDefault(require("./functions/decryptTerms"));
const ads = new ads_model_1.default();
// return created ad
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.files);
        // Converting features and terms to bitset (e.g 01101)
        const features = (0, encryptFeatures_1.default)((req.body.features ? req.body.features : "").split('-'));
        const terms = (0, encryptTerms_1.default)((req.body.terms ? req.body.terms : "").split('-'));
        const images_description = req.body.images_description ? req.body.images_description.split('-') : [];
        const images_url = yield (0, uploadImages_1.default)(req.files, 'Ads Images');
        const ad = {
            city: req.body.city,
            gender: req.body.gender,
            price: req.body.price,
            price_per: req.body.price_per,
            space_type: req.body.space_type,
            title: req.body.title,
            description: req.body.description,
            lat: req.body.lat,
            lng: req.body.lng,
            governorate: req.body.governorate,
            phone_number: req.body.phone_number,
            email: req.body.email,
            features: features,
            terms: terms,
            images: images_url,
            images_description: images_description
        };
        const result = yield ads.create(res.locals.user, ad);
        if (result.Message.includes('successfully'))
            res.json(result);
        else
            res.json(result).status(301);
    }
    catch (e) {
        console.log('Error in create function in ads.controller');
        throw e;
    }
});
exports.create = create;
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield ads.getAll();
        // decrypt features and terms
        for (let ad of result) {
            ad.features = (0, decryptFeatures_1.default)(ad.features);
            ad.terms = (0, decryptTerms_1.default)(ad.terms);
        }
        res.json({ Message: 'Data retrieved successfully', Flag: true, ads: result });
    }
    catch (e) {
        console.log('Error in getAll function in ads.controller');
        throw e;
    }
});
exports.getAll = getAll;
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield ads.get(req.body.ad_id);
        if (!result.Message.includes('successfully'))
            return res.json(result);
        result.ad.features = (0, decryptFeatures_1.default)(result.ad.features);
        result.ad.terms = (0, decryptTerms_1.default)(result.ad.terms);
        res.json(result);
    }
    catch (e) {
        console.log('Error in get function in ads.controller');
        res.json({ Message: 'An error occured', Flag: false });
    }
});
exports.get = get;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield ads.search();
    return res.json('Done');
});
exports.search = search;
const deleteAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ads.deleteAd(req.body.ad_id, res.locals.user);
    if (result.Message.includes('successfully'))
        return res.json(result);
    else
        return res.json(result).status(301);
});
exports.deleteAd = deleteAd;
