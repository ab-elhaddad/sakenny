"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports._delete = exports._update = exports._read = exports._create = exports.getByUser = exports.update = exports.deleteAd = exports.search = exports.get = exports.getAll = exports.create = void 0;
const ads_model_1 = __importDefault(require("../models/ads.model"));
const encryptFeatures_1 = __importStar(require("./functions/encryptFeatures"));
const uploadImages_1 = __importDefault(require("./functions/uploadImages"));
const encryptTerms_1 = __importStar(require("./functions/encryptTerms"));
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
        for (let returnedAd of result.ads) {
            returnedAd.features = (0, decryptFeatures_1.default)(returnedAd.features);
            returnedAd.terms = (0, decryptTerms_1.default)(returnedAd.terms);
        }
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
    try {
        let ad = {
            city: req.body.city,
            governorate: req.body.governorate,
            space_type: req.body.space_type,
            start_price: req.body.start_price,
            end_price: req.body.end_price,
            features: req.body.features ? (0, encryptFeatures_1.default)(req.body.features.split('-')) : encryptFeatures_1.ALL_FEATURES,
            terms: req.body.terms ? (0, encryptTerms_1.default)(req.body.terms.split('-')) : encryptTerms_1.ALL_TERMS,
        };
        const result = yield ads.search(ad);
        if (result.Ads)
            for (let ad of result.Ads) {
                ad.features = (0, decryptFeatures_1.default)(ad.features);
                ad.terms = (0, decryptTerms_1.default)(ad.terms);
            }
        return res.json(result);
    }
    catch (e) {
        console.log('Error in search function in ads.controller');
        res.json({ Message: 'An error occured', Flag: false });
    }
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
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = {
            new_city: req.body.new_city,
            new_description: req.body.new_description,
            new_email: req.body.new_email,
            new_gender: req.body.new_gender,
            new_governorate: req.body.new_governorate,
            new_lat: req.body.new_lat,
            new_lng: req.body.new_lng,
            new_phone_number: req.body.new_phone_number,
            new_price: req.body.new_price,
            new_price_per: req.body.new_price_per,
            new_space_type: req.body.new_space_type,
            new_title: req.body.new_title,
            new_features: req.body.new_features != undefined ? (0, encryptFeatures_1.default)(req.body.new_features.split('-')) : undefined,
            new_terms: req.body.new_terms != undefined ? (0, encryptTerms_1.default)(req.body.new_terms.split('-')) : undefined,
        };
        const result = yield ads.update(req.body.ad_id, ad);
        result.ad.features = (0, decryptFeatures_1.default)(result.ad.features);
        result.ad.terms = (0, decryptTerms_1.default)(result.ad.terms);
        console.log(result);
        if (result.Message.includes('successfully'))
            res.json(result);
        else
            res.json(result).status(401);
    }
    catch (e) {
        console.log('Error in update ads.controller\n', e);
        return res.json({ Message: 'Some error has occured' }).status(401);
    }
});
exports.update = update;
const getByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield ads.getByUser(res.locals.user);
        if (result.Message.includes('successfully')) {
            for (const ad of result.Ads) {
                ad.features = (0, decryptFeatures_1.default)(ad.features);
                ad.terms = (0, decryptTerms_1.default)(ad.terms);
            }
            res.json(Object.assign({ Flag: true }, result));
        }
        else
            res.json(result).status(401);
    }
    catch (e) {
        console.log('Error in getByUser function in ads.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false });
    }
});
exports.getByUser = getByUser;
// CRUD Operations
const _create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        yield ads._create(ad);
        res.json({ Message: 'Ad created successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _create function in ads.controller');
        res.json({ Message: 'An error occured', Flag: false });
    }
});
exports._create = _create;
const _read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield ads._read();
        res.json({ Message: 'Data retrived successfully', Flag: true, Ads: result });
    }
    catch (e) {
        console.log('Error in _read function in ads.controller');
        res.json({ Message: 'An error occured', Flag: false });
    }
});
exports._read = _read;
const _update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = {
            new_city: req.body.new_city,
            new_description: req.body.new_description,
            new_email: req.body.new_email,
            new_gender: req.body.new_gender,
            new_governorate: req.body.new_governorate,
            new_lat: req.body.new_lat,
            new_lng: req.body.new_lng,
            new_phone_number: req.body.new_phone_number,
            new_price: req.body.new_price,
            new_price_per: req.body.new_price_per,
            new_space_type: req.body.new_space_type,
            new_title: req.body.new_title,
            new_features: req.body.new_features != undefined ? (0, encryptFeatures_1.default)(req.body.new_features.split('-')) : undefined,
            new_terms: req.body.new_terms != undefined ? (0, encryptTerms_1.default)(req.body.new_terms.split('-')) : undefined,
        };
        yield ads._update(req.body.ad_id, ad);
        res.json({ Message: 'Ad updated successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _update function in ads.controller');
        res.json({ Message: 'An error occured', Flag: false });
    }
});
exports._update = _update;
const _delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ads._delete(req.body.ad_id);
        res.json({ Message: 'Ad deleted successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _delete function in ads.controller');
        res.json({ Message: 'An error occured', Flag: false });
    }
});
exports._delete = _delete;
