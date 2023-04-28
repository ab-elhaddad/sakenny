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
exports.create = exports.getAll = void 0;
const ads_model_1 = __importDefault(require("../models/ads.model"));
const ads = new ads_model_1.default();
const getAll = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield ads.getAll();
        res.json({ Message: 'Data retrieved successfully', Flag: true, Data: result });
    }
    catch (e) {
        console.log('Error in getAll function in ads.controller');
        throw e;
    }
});
exports.getAll = getAll;
// NOT TESTED YET
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = {
            address: req.body.address,
            city: req.body.city,
            gender: req.body.gender,
            price: req.body.price,
            price_per: req.body.price_per,
            space_type: req.body.space_type,
            title: req.body.title,
            description: req.body.description,
            lat: req.body.lat,
            lng: req.body.lng,
            services: req.body.services
        };
        const result = yield ads.create(res.locals.user, req.files, ad);
        if (result.includes('successfully'))
            res.json({ Message: result, Flag: true });
        else
            res.json({ Message: result, Flag: false }).status(301);
    }
    catch (e) {
        console.log('Error in create function in ads.controller');
        throw e;
    }
});
exports.create = create;
