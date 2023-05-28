"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myTerms = ['No Pets', 'No Smoking', 'Share Bills', 'Share Cleaning Works'];
const decryptTerms = (terms) => {
    let res = [];
    for (let i = 0; i < myTerms.length; i++) {
        if (terms[i] === '1')
            res.push(myTerms[i]);
    }
    return res;
};
exports.default = decryptTerms;
