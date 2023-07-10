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
const ad_images_model_1 = __importDefault(require("../../models/ad_images.model"));
const users_model_1 = require("../../models/users.model");
const ads_model_1 = __importDefault(require("../../models/ads.model"));
const ad_images = new ad_images_model_1.default();
const users = new users_model_1.Users();
const ads = new ads_model_1.default();
xdescribe('Testing ad_images.model.ts', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const u = {
            fullname: 'testUser',
            email: 'test@test.com',
            phone_number: '012345',
            password: 'test'
        };
        yield users.register(u);
        const ad = {
            title: 'testTitle',
            space_type: 'flat',
            description: 'testDescription',
            price: 1000,
            city: 'testCity',
            governorate: 'testGovernorate',
            lat: '000',
            lng: '000',
            gender: true,
            email: 'testEmail',
            phone_number: '012345',
            features: '111000000000',
            terms: '1100',
            price_per: 'month',
            images: ['url1', 'url2'],
            images_description: ['desc1', 'desc2']
        };
        yield ads.create('test@test.com', ad);
    }));
    describe('Testing addImage', () => __awaiter(void 0, void 0, void 0, function* () {
        // Successfull addImage
        it('Should add the image and return desclaimer', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ad_images.addImage(1, 'url3', 'desc3');
            expect(res).toEqual({ Message: "Image added successfully", Flag: true });
        }));
        // Unsuccessfull addImage
        it('Should return an error message', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ad_images.addImage(2, 'url3', 'desc3');
            expect(res).toEqual({ Message: "Something went wrong!", Flag: false });
        }));
    }));
    describe('Testing deleteImage', () => __awaiter(void 0, void 0, void 0, function* () {
        // Successfull deleteImage
        it('Should delete the image and return desclaimer', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ad_images.deleteImage(1, 'url3', 'test@test.com');
            expect(res).toEqual({ Message: "Image deleted successfully", Flag: true });
        }));
        // Unsuccessfull deleteImage
        it('Should return an error message ( Invalid URL)', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ad_images.deleteImage(1, 'url4', 'test@test.com');
            expect(res).toEqual({ Message: "No such image with the provided url", Flag: false });
        }));
    }));
    describe('Testing _deleteImage', () => __awaiter(void 0, void 0, void 0, function* () {
        // Successfull _deleteImage
        it('Should delete the image', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ad_images._deleteImage('url2');
            expect(res).toEqual({ Flag: true });
        }));
        // Unsuccessfull _deleteImage
        it('Should return an error message ( Invalid URL)', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ad_images._deleteImage('url4');
            expect(res).toEqual({ Flag: false });
        }));
    }));
});
