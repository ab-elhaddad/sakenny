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
const admins_model_1 = __importDefault(require("../../models/admins.model"));
const admins = new admins_model_1.default();
describe('Testing Admins Model', () => {
    describe('Testing signUp function', () => __awaiter(void 0, void 0, void 0, function* () {
        // Successful signUp
        it('Should return token', () => __awaiter(void 0, void 0, void 0, function* () {
            const username = 'admin';
            const password = 'admin';
            const token = yield admins.signUp(username, password);
            expect(token).toBeTruthy();
        }));
        // Unsuccessful signUp [existed username]
        it('Should return null [existed username]', () => __awaiter(void 0, void 0, void 0, function* () {
            const username = 'admin';
            const password = 'admin';
            const token = yield admins.signUp(username, password);
            expect(token).toBeNull();
        }));
    }));
    describe('Testing signIn function', () => __awaiter(void 0, void 0, void 0, function* () {
        // Successful signIn
        it('Should return token', () => __awaiter(void 0, void 0, void 0, function* () {
            const username = 'admin';
            const password = 'admin';
            const token = yield admins.signIn(username, password);
            expect(token).toBeTruthy();
        }));
        // Unsuccessful signIn [wrong password]
        it('Should return null [wrong password]', () => __awaiter(void 0, void 0, void 0, function* () {
            const username = 'admin';
            const password = 'WRONG PASSWORD';
            const token = yield admins.signIn(username, password);
            expect(token).toBeNull();
        }));
    }));
});
