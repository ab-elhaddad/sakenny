const myFeatures: string[] = ['WiFi', 'Kitchen', 'Bathroom', 'Air Conditioner', 'Heater', 'Washing Machine', 'Cooker', 'Balcony', 'Refrigerator', 'TV', 'Microwave', 'Elevator'];
export const ALL_FEATURES = '111111111111';

const encryptFeatues = (features: string[]): string => {
    let res = "";
    for (const myFeature of myFeatures) {
        if (features.includes(myFeature))
            res += '1';
        else
            res += '0';
    }
    return res;
}

export default encryptFeatues;