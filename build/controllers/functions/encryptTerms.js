"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myTerms = ['No Pets', 'No Smoking', 'Share Bills', 'Share Cleaning Works'];
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
