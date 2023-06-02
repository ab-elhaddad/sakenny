import express from 'express';
import Ads from '../models/ads.model';
import Ad from '../types/Ad.type';
import encryptFeatues from './functions/encryptFeatures';
import uploadImages from './functions/uploadImages';
import encryptTerms from './functions/encryptTerms';
import decryptFeatures from './functions/decryptFeatures';
import decryptTerms from './functions/decryptTerms';

const ads = new Ads();

// return created ad
export const create = async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.files);
        // Converting features and terms to bitset (e.g 01101)
        const features = encryptFeatues((req.body.features ? req.body.features : "").split('-'));
        const terms = encryptTerms((req.body.terms ? req.body.terms : "").split('-'));

        const images_description = req.body.images_description ? (req.body.images_description as string).split('-') : [];
        const images_url: string[] = await uploadImages(req.files, 'Ads Images');

        const ad: Ad = {
            city: req.body.city,
            gender: req.body.gender as boolean,
            price: req.body.price as number,
            price_per: req.body.price_per,
            space_type: req.body.space_type,
            title: req.body.title,
            description: req.body.description,
            lat: req.body.lat,
            lng: req.body.lng,
            governorate: req.body.governorate,
            phone_number: req.body.phone_number,
            email: req.body.email,
            features: features,
            terms: terms,
            images: images_url,
            images_description: images_description
        }

        const result = await ads.create(res.locals.user, ad);
        if (result.Message.includes('successfully'))
            res.json(result);
        else
            res.json(result).status(301);
    } catch (e) {
        console.log('Error in create function in ads.controller');
        throw e;
    }
}

export const getAll = async (_req: express.Request, res: express.Response) => {
    try {
        const result = await ads.getAll();

        // decrypt features and terms
        for (let ad of result) {
            ad.features = decryptFeatures(ad.features);
            ad.terms = decryptTerms(ad.terms);
        }

        res.json({ Message: 'Data retrieved successfully', Flag: true, ads: result });
    }
    catch (e) {
        console.log('Error in getAll function in ads.controller');
        throw e;
    }
}

export const get = async (req: express.Request, res: express.Response) => {
    try {
        const result = await ads.get(req.body.ad_id);
        if (!result.Message.includes('successfully'))
            return res.json(result);
        result.ad.features = decryptFeatures(result.ad.features);
        result.ad.terms = decryptTerms(result.ad.terms);
        res.json(result);
    }
    catch (e) {
        console.log('Error in get function in ads.controller');
        res.json({ Message: 'An error occured', Flag: false });
    }
}

export const search = async (req: express.Request, res: express.Response) => {
    await ads.search();
    return res.json('Done');
}