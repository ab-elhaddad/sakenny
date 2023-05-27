import express from 'express';
import Ads from '../models/ads.model';
import Ad from '../types/Ad.type';
import encryptFeatues from './functions/encryptFeatures';
import uploadImages from './functions/uploadImages';

const ads = new Ads();

export const getAll = async (_req: express.Request, res: express.Response) => {
    try {
        const result = await ads.getAll();
        res.json({ Message: 'Data retrieved successfully', Flag: true, Data: result });
    }
    catch (e) {
        console.log('Error in getAll function in ads.controller');
        throw e;
    }
}

// NOT TESTED YET
export const create = async (req: express.Request, res: express.Response) => {
    try {
        //console.log(req);
        // Converting features and terms to bitset (e.g 01101)
        const features = encryptFeatues((req.body.features ? req.body.features : "").split('-'));
        const terms = encryptFeatues((req.body.terms ? req.body.terms : "").split('-'));

        const images_description = req.body.images_description ? (req.body.images_description as string).split('-') : [];
        const images_url: string[] = await uploadImages(req.files, 'Ads Images');
        console.log(req.files);
        console.log(images_url);

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
        if (result.includes('successfully'))
            res.json({ Message: result, Flag: true });
        else
            res.json({ Message: result, Flag: false }).status(301);
    } catch (e) {
        console.log('Error in create function in ads.controller');
        throw e;
    }
}

export const search = async (req: express.Request, res: express.Response) => {
    await ads.search();
    return res.json('Done');
}