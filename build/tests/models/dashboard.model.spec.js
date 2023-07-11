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
const ads_model_1 = __importDefault(require("../../models/ads.model"));
const users_model_1 = require("../../models/users.model");
const ad_images = new ad_images_model_1.default();
const users = new users_model_1.Users();
const ads = new ads_model_1.default();
describe('Testing Dashboard', () => {
    describe('Testing user functionalities', () => {
        it('Create [Should insert new user]', () => __awaiter(void 0, void 0, void 0, function* () {
            const u = {
                fullname: 'testUser',
                email: 'test@test.com',
                phone_number: '012345',
                password: 'test'
            };
            yield users.register(u);
            const numOfUsers = yield users._read();
            expect(numOfUsers.length).toEqual(1);
        }));
        it('Update [Should update user]', () => __awaiter(void 0, void 0, void 0, function* () {
            // all data should be sent
            const updatedUser = {
                id: 1,
                fullname: 'NEW FULLNAME',
                email: 'test@test.com',
                phone_number: 'NEW PHONE NUMBER',
                password: 'test'
            };
            yield users._update(updatedUser);
            const user = (yield users._read())[0];
            expect(user.fullname).toEqual(updatedUser.fullname);
            expect(user.phone_number).toEqual(updatedUser.phone_number);
        }));
        it('Delete [Should delete user]', () => __awaiter(void 0, void 0, void 0, function* () {
            yield users._delete(1);
            const numOfUsers = yield users._read();
            expect(numOfUsers.length).toEqual(0);
        }));
        it('Read [Should get all users]', () => __awaiter(void 0, void 0, void 0, function* () {
            const numOfUsers = yield users._read();
            expect(numOfUsers.length).toEqual(0);
        }));
    });
    describe('Testing ad functionalities', () => {
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
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            // This user will have id = 2
            const u = {
                fullname: 'testUser',
                email: 'test@test.com',
                phone_number: '012345',
                password: 'test'
            };
            yield users.register(u);
        }));
        it('Create [Should insert new ad]', () => __awaiter(void 0, void 0, void 0, function* () {
            yield ads._create(2, ad);
            const numOfAds = yield ads._read();
            expect(numOfAds.length).toEqual(1);
        }));
        it('Update [Should update ad]', () => __awaiter(void 0, void 0, void 0, function* () {
            // Changing title, price, gender, and features
            const updated_ad = {
                new_title: 'NEW TITLE',
                new_space_type: 'flat',
                new_description: 'testDescription',
                new_price: 500,
                new_city: 'testCity',
                new_governorate: 'testGovernorate',
                new_lng: '000',
                new_lat: '000',
                new_gender: false,
                new_email: 'testEmail',
                new_phone_number: '012345',
                new_price_per: 'month',
                new_features: '101010000000',
                new_terms: '1100',
            };
            yield ads._update(1, updated_ad);
            const insertedAd = (yield ads._read())[0];
            expect(insertedAd.title).toEqual(updated_ad.new_title);
            expect(insertedAd.price).toEqual(updated_ad.new_price);
            expect(insertedAd.gender).toEqual(updated_ad.new_gender);
            expect(insertedAd.features).toEqual('10101000000000000000');
        }));
        it('addImage [Should add single image in an ad]', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ad_images.addImage(1, 'url3', 'desc3');
            expect(res).toEqual({ Message: "Image added successfully", Flag: true });
        }));
        it('deleteImage [Should delete single image in an ad]', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ad_images._deleteImage('url3');
            expect(res).toEqual({ Flag: true });
        }));
        it('Delete [Should delete ad]', () => __awaiter(void 0, void 0, void 0, function* () {
            yield ads._delete(1);
            const numOfAds = yield ads._read();
            expect(numOfAds.length).toEqual(0);
        }));
        it('Read [Should get all ads]', () => __awaiter(void 0, void 0, void 0, function* () {
            const numOfAds = yield ads._read();
            expect(numOfAds.length).toEqual(0);
        }));
    });
});
