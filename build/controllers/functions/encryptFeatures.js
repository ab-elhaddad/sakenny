"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myFeatures = ['WiFi', 'Kitchen', 'Bathroom', 'Air Conditioner', 'Heater', 'Washing Machine', 'Cooker', 'Balcony', 'Refrigerator', 'TV', 'Microwave', 'Elevator'];
const encryptFeatues = (features) => {
    let res = "";
    for (const myFeature of myFeatures) {
        if (features.includes(myFeature))
            res += '1';
        else
            res += '0';
    }
    return res;
};
exports.default = encryptFeatues;
