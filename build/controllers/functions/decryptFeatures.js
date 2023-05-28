"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myFeatures = ['WiFi', 'Kitchen', 'Bathroom', 'Air Conditioner', 'Heater', 'Washing Machine', 'Cooker', 'Balcony', 'Refrigerator', 'TV', 'Microwave', 'Elevator'];
const decryptFeatures = (features) => {
    const res = [];
    for (let i = 0; i < myFeatures.length; i++) {
        if (features[i] === '1')
            res.push(myFeatures[i]);
    }
    return res;
};
exports.default = decryptFeatures;
