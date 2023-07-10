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
exports.signIn = exports.signUp = void 0;
const admins_model_1 = __importDefault(require("../models/admins.model"));
const admins = new admins_model_1.default();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const token = yield admins.signUp(username, password);
        if (token)
            res.json({ Flag: true, Token: token });
        else
            res.json({ Flag: false }).status(401);
    }
    catch (e) {
        console.log('Error in signUp function in admins\n', e);
        res.json({ Flag: false }).status(401);
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const token = yield admins.signIn(username, password);
        if (token)
            res.json({ Flag: true, Token: token });
        else
            res.json({ Flag: false }).status(401);
    }
    catch (e) {
        console.log('Error in signIn function in admins\n', e);
    }
});
exports.signIn = signIn;
