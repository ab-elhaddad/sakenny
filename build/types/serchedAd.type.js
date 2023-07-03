"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSearchedAd = void 0;
const checkSearchedAd = (ad) => {
    let flag = false;
    flag || (flag = ad.governorate != undefined);
    flag || (flag = ad.city != undefined);
    flag || (flag = ad.space_type != undefined);
    flag || (flag = ad.start_price != undefined);
    flag || (flag = ad.end_price != undefined);
    flag || (flag = ad.features != undefined);
    flag || (flag = ad.terms != undefined);
    return flag;
};
exports.checkSearchedAd = checkSearchedAd;
