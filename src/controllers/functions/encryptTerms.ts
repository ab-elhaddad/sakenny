const myTerms: string[] = ['No Pets', 'No Smoking', 'Share Bills', 'Share Cleaning Works'];
export const ALL_TERMS = '1111';

const encryptTerms = (features: string[]): string => {
    let res = "";
    for (const myTerm of myTerms) {
        if (features.includes(myTerm))
            res += '1';
        else
            res += '0';
    }
    return res;
}

export default encryptTerms;