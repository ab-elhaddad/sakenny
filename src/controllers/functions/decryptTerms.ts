const myTerms: string[] = ['No Pets', 'No Smoking', 'Share Bills', 'Share Cleaning Works'];

const decryptTerms = (terms) => {
    let res: string[] = [];
    for (let i = 0; i < myTerms.length; i++) {
        if (terms[i] === '1')
            res.push(myTerms[i]);
    }
    return res;
}

export default decryptTerms;