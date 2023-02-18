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
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = require("./../../models/users.model");
const users = new users_model_1.Users();
describe("Testing Users Model", () => {
    it("Should return The Insrted User", () => __awaiter(void 0, void 0, void 0, function* () {
        const u = {
            fullname: 'test1',
            email: 'test1@test1.com',
            phone_number: '012345',
            password: 'test1',
        };
        const res = yield users.register(u);
    }));
});
