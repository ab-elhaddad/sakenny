const myFeatures: string[] = ['WiFi', 'Kitchen', 'Bathroom', 'Air Conditioner', 'Heater', 'Washing Machine', 'Cooker', 'Balcony', 'Refrigerator', 'TV', 'Microwave', 'Elevator'];

const decryptFeatures = (features: string): string[] => {
    const res: string[] = [];
    for (let i = 0; i < myFeatures.length; i++) {
        if (features[i] === '1')
            res.push(myFeatures[i]);
    }
    return res;
}

export default decryptFeatures;