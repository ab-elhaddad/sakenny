import express from 'express';
import Ads from '../models/ads.model';
import Ad from '../types/Ad.type';
import encryptFeatues, { ALL_FEATURES } from './functions/encryptFeatures';
import uploadImages from './functions/uploadImages';
import encryptTerms, { ALL_TERMS } from './functions/encryptTerms';
import decryptFeatures from './functions/decryptFeatures';
import decryptTerms from './functions/decryptTerms';
import { updatedAd } from '../types/updatedAd.type';
import { searchedAd } from '../types/serchedAd.type';

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

        const result = await ads.create(req.body.user, ad);

        result.ad.features = decryptFeatures(result.ad.features);
        result.ad.terms = decryptTerms(result.ad.terms);

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
    try {
        let ad: searchedAd = {
            city: req.body.city,
            governorate: req.body.governorate,
            space_type: req.body.space_type,
            start_price: req.body.start_price,
            end_price: req.body.end_price,
            features: req.body.features ? encryptFeatues(req.body.features.split('-')) : ALL_FEATURES,
            terms: req.body.terms ? encryptTerms(req.body.terms.split('-')) : ALL_TERMS,
        }
        const result = await ads.search(ad);

        if (result.Ads)
            for (let ad of result.Ads) {
                ad.features = decryptFeatures(ad.features);
                ad.terms = decryptTerms(ad.terms);
            }

        return res.json(result);
    }
    catch (e) {
        console.log('Error in search function in ads.controller');
        res.json({ Message: 'An error occured', Flag: false });
    }
}

export const simpleSearch = async (req: express.Request, res: express.Response) => {
    try {
        const result = await ads.simpleSearch(req.body.governorate, req.body.city, req.body.space_type);
        if (result.Flag)
            return res.json(result);
        else
            return res.json(result).status(401);
    }
    catch (e) {
        console.log('Error in simpleSearch function in ads.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false });
    }
}

export const deleteAd = async (req: express.Request, res: express.Response) => {
    const result = await ads.deleteAd(req.body.ad_id, res.locals.user);

    if (result.Message.includes('successfully'))
        return res.json(result);
    else
        return res.json(result).status(301);
}

export const update = async (req: express.Request, res: express.Response) => {
    try {
        const ad: updatedAd = {
            new_city: req.body.new_city,
            new_description: req.body.new_description,
            new_email: req.body.new_email,
            new_gender: req.body.new_gender,
            new_governorate: req.body.new_governorate,
            new_lat: req.body.new_lat,
            new_lng: req.body.new_lng,
            new_phone_number: req.body.new_phone_number,
            new_price: req.body.new_price,
            new_price_per: req.body.new_price_per,
            new_space_type: req.body.new_space_type,
            new_title: req.body.new_title,
            new_features: req.body.new_features != undefined ? encryptFeatues(req.body.new_features.split('-')) : undefined,
            new_terms: req.body.new_terms != undefined ? encryptTerms(req.body.new_terms.split('-')) : undefined,
        }

        const result = await ads.update(req.body.ad_id, ad);
        result.ad.features = decryptFeatures(result.ad.features);
        result.ad.terms = decryptTerms(result.ad.terms);

        console.log(result);

        if (result.Message.includes('successfully'))
            res.json(result);
        else
            res.json(result).status(401);
    }
    catch (e) {
        console.log('Error in update ads.controller\n', e);
        return res.json({ Message: 'Some error has occured' }).status(401);
    }
}

export const getByUser = async (req: express.Request, res: express.Response) => {
    try {
        const result = await ads.getByUser(res.locals.user);
        if (result.Message.includes('successfully')) {
            for (const ad of result.Ads) {
                ad.features = decryptFeatures(ad.features);
                ad.terms = decryptTerms(ad.terms);
            }
            res.json({ Flag: true, ...result });
        }
        else
            res.json(result).status(401);
    }
    catch (e) {
        console.log('Error in getByUser function in ads.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false });
    }
}

// CRUD Operations

export const _create = async (req: express.Request, res: express.Response) => {
    try {
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

        await ads._create(req.body.user_id, ad);
        res.json({ Message: 'Ad created successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _create function in ads.controller');
        res.json({ Message: 'An error occured', Flag: false });
    }
}

export const _read = async (req: express.Request, res: express.Response) => {
    try {
        const result = await ads._read();

        for (const ad of result) {
            ad.features = decryptFeatures(ad.features);
            ad.terms = decryptTerms(ad.terms);
        }

        res.json({ Message: 'Data retrived successfully', Flag: true, Ads: result });
    }
    catch (e) {
        console.log('Error in _read function in ads.controller\n', e);
        res.json({ Message: 'An error occured', Flag: false });
    }
}

export const _update = async (req: express.Request, res: express.Response) => {
    try {
        const ad: updatedAd = {
            new_city: req.body.new_city,
            new_description: req.body.new_description,
            new_email: req.body.new_email,
            new_gender: req.body.new_gender,
            new_governorate: req.body.new_governorate,
            new_lat: req.body.new_lat,
            new_lng: req.body.new_lng,
            new_phone_number: req.body.new_phone_number,
            new_price: req.body.new_price,
            new_price_per: req.body.new_price_per,
            new_space_type: req.body.new_space_type,
            new_title: req.body.new_title,
            new_features: req.body.new_features != undefined ? encryptFeatues(req.body.new_features.split('-')) : undefined,
            new_terms: req.body.new_terms != undefined ? encryptTerms(req.body.new_terms.split('-')) : undefined,
        }

        await ads._update(req.body.ad_id, ad);
        res.json({ Message: 'Ad updated successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _update function in ads.controller');
        res.json({ Message: 'An error occured', Flag: false });
    }
}

export const _delete = async (req: express.Request, res: express.Response) => {
    try {
        await ads._delete(req.body.ad_id);
        res.json({ Message: 'Ad deleted successfully', Flag: true });
    }
    catch (e) {
        console.log('Error in _delete function in ads.controller');
        res.json({ Message: 'An error occured', Flag: false });
    }
}