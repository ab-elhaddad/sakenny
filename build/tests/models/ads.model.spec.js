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
const ads_model_1 = __importDefault(require("../../models/ads.model"));
const users_model_1 = require("../../models/users.model");
const index_1 = __importDefault(require("./../../database/index"));
const ads = new ads_model_1.default();
const users = new users_model_1.Users();
xdescribe("Testing Ads Model", () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const u = {
            fullname: 'testUser',
            email: 'test@test.com',
            phone_number: '012345',
            password: 'test'
        };
        yield users.register(u);
    }));
    describe("Testing Create function", () => {
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
            images_description: ['desc1', 'desc2'],
            creation_date: formattedDate
        };
        // Successful create
        it("Create [Should return the created ad]", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ads.create('test@test.com', ad);
            const returnedAd = {
                id: 1,
                user_id: 1,
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
                features: '11100000000000000000',
                terms: '1100000000',
                price_per: 'month',
                images: [
                    {
                        id: 1,
                        ad_id: 1,
                        url: 'url1',
                        description: 'desc1'
                    },
                    {
                        id: 2,
                        ad_id: 1,
                        url: 'url2',
                        description: 'desc2'
                    }
                ],
                creation_date: formattedDate
            };
            expect(res).toEqual({
                Message: 'Ad inserted successfully',
                Flag: true,
                ad: returnedAd
            });
        }));
        // Failed create
        it("Create [Should return a disclaimer]", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ads.create('WRONG EMAIL', ad);
            expect(res).toEqual({ Message: 'User not found', Flag: false });
        }));
    });
    describe("Testing search function", () => {
        // Successful search
        it("Search [Should return the ads]", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const searched_ad = {
                city: 'testCity',
                governorate: 'testGovernorate',
                space_type: 'flat',
                start_price: 0,
                end_price: 1000,
                features: '11100000000000000000',
                terms: '1100000000'
            };
            const res = yield ads.search(searched_ad);
            expect((_a = res.Ads) === null || _a === void 0 ? void 0 : _a.length).toBeGreaterThan(0);
        }));
        // Zero output search
        it("Search [Should return no ads]", () => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const searched_ad = {
                city: 'testCity',
                governorate: 'testGovernorate',
                space_type: 'bed',
                start_price: 0,
                end_price: 1000,
                features: '11100000000000000000',
                terms: '1100000000'
            };
            const res = yield ads.search(searched_ad);
            expect((_b = res.Ads) === null || _b === void 0 ? void 0 : _b.length).toEqual(0);
        }));
    });
    describe("Testing simpleSearch function", () => {
        // Successful search
        it("Search [Should return the ads]", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const res = yield ads.simpleSearch('testGovernorate', 'testCity', 'flat');
            expect((_a = res.Ads) === null || _a === void 0 ? void 0 : _a.length).toBeGreaterThan(0);
        }));
        // Zero output search
        it("Search [Should return no ads]", () => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const res = yield ads.simpleSearch('testCity2', 'testGovernorate', 'flat');
            expect((_b = res.Ads) === null || _b === void 0 ? void 0 : _b.length).toEqual(0);
        }));
    });
    describe("Testing getImages function", () => __awaiter(void 0, void 0, void 0, function* () {
        // Successful get
        it("Get Images [Should return the images]", () => __awaiter(void 0, void 0, void 0, function* () {
            const connection = yield index_1.default.connect();
            const res = yield ads.getImages(1, connection);
            connection.release();
            expect(res).toEqual([
                {
                    url: 'url1',
                    description: 'desc1'
                },
                {
                    url: 'url2',
                    description: 'desc2'
                }
            ]);
        }));
        // Failed get
        it("Get Images [Should return an empty array]", () => __awaiter(void 0, void 0, void 0, function* () {
            const connection = yield index_1.default.connect();
            const res = yield ads.getImages(2, connection);
            connection.release();
            expect(res).toEqual([]);
        }));
    }));
    describe("Testing update function", () => __awaiter(void 0, void 0, void 0, function* () {
        // Successful update
        it("Update [Should return the updated ad]", () => __awaiter(void 0, void 0, void 0, function* () {
            const ad = {
                new_title: 'testTitle2',
                new_space_type: undefined,
                new_description: undefined,
                new_price: 500,
                new_city: 'testCity2',
                new_governorate: undefined,
                new_lat: '123',
                new_lng: undefined,
                new_gender: false,
                new_email: undefined,
                new_phone_number: undefined,
                new_features: '10101000000000000000',
                new_terms: undefined,
                new_price_per: 'day'
            };
            const res = (yield ads.update(1, ad)).ad;
            expect(res.title).toEqual('testTitle2');
            expect(res.price).toEqual(500);
            expect(res.city).toEqual('testCity2');
            expect(res.lat).toEqual('123');
            expect(res.features).toEqual('10101000000000000000');
            expect(res.price_per).toEqual('day');
        }));
        // Failed update
        it("Update [Should return a disclaimer]", () => __awaiter(void 0, void 0, void 0, function* () {
            const ad = {
                new_title: 'testTitle2',
                new_space_type: undefined,
                new_description: undefined,
                new_price: 500,
                new_city: 'testCity2',
                new_governorate: undefined,
                new_lat: '123',
                new_lng: undefined,
                new_gender: false,
                new_email: undefined,
                new_phone_number: undefined,
                new_features: '10101000000000000000',
                new_terms: undefined,
                new_price_per: 'day'
            };
            const res = yield ads.update(2, ad);
            expect(res).toEqual({ Message: 'Ad not found', Flag: false });
        }));
    }));
    describe("Testing getAll function", () => __awaiter(void 0, void 0, void 0, function* () {
        // Successful get
        it("Get All [Should return all ads]", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ads.getAll();
            expect(res.length).toBeGreaterThan(0);
        }));
    }));
    describe("Testing get function", () => __awaiter(void 0, void 0, void 0, function* () {
        // Successful get
        it("Get [Should return the ad]", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ads.get(1);
            const returnedAd = {
                id: 1,
                user_id: 1,
                title: 'testTitle2',
                space_type: 'flat',
                description: 'testDescription',
                price: 500,
                city: 'testCity2',
                governorate: 'testGovernorate',
                lat: '123',
                lng: '000',
                gender: false,
                email: 'testEmail',
                phone_number: '012345',
                features: '10101000000000000000',
                terms: '1100000000',
                price_per: 'day',
                images: [
                    {
                        id: 1,
                        ad_id: 1,
                        url: 'url1',
                        description: 'desc1'
                    },
                    {
                        id: 2,
                        ad_id: 1,
                        url: 'url2',
                        description: 'desc2'
                    }
                ],
                creation_date: formattedDate
            };
            expect(res).toEqual({ Message: "Ad retrived successfully", Flag: true, ad: returnedAd });
        }));
        // Failed get
        it("Get [Should return a disclaimer]", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ads.get(2);
            expect(res).toEqual({ Message: "No such ad with the provided id", Flag: false });
        }));
    }));
    describe("Testing getByUser function", () => __awaiter(void 0, void 0, void 0, function* () {
        // Successful get
        it("Get By User [Should return the ads]", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const res = yield ads.getByUser('test@test.com');
            expect((_a = res.Ads) === null || _a === void 0 ? void 0 : _a.length).toBeGreaterThan(0);
        }));
        // Failed get
        it("Get By User [Should return a disclaimer]", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ads.getByUser('WRONG EMAIL');
            expect(res).toEqual({ Message: "Couldnt retrive data", Flag: false });
        }));
    }));
    describe("Testing deleteAd function", () => __awaiter(void 0, void 0, void 0, function* () {
        // Failed delete
        it("Delete Ad (Wrong user) [Should return a disclaimer]", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ads.deleteAd(1, 'WORNG EMAIL');
            expect(res).toEqual({ Message: "No such user with the provided email or phone number", Flag: false });
        }));
        // Failed delete
        it("Delete Ad (Wrong Ad id) [Should return a disclaimer]", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ads.deleteAd(2, 'test@test.com');
            expect(res).toEqual({ Message: "No such ad with the provided id", Flag: false });
        }));
        // Successful delete
        it("Delete Ad [Should return a disclaimer]", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield ads.deleteAd(1, 'test@test.com');
            expect(res).toEqual({ Message: "Ad deleted successfully", Flag: true });
        }));
    }));
});
