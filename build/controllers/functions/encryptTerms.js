"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_TERMS = void 0;
const myTerms = ['No Pets', 'No Smoking', 'Share Bills', 'Share Cleaning Works'];
exports.ALL_TERMS = '1111';
const encryptTerms = (features) => {
    let res = "";
    for (const myTerm of myTerms) {
        if (features.includes(myTerm))
            res += '1';
        else
            res += '0';
    }
    return res;
};
exports.default = encryptTerms;
