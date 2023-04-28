import express from 'express';
import Ads from '../models/ads.model';
import Ad from '../types/Ad.type';

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
        const ad: Ad = {
            address: req.body.address,
            city: req.body.city,
            gender: req.body.gender,
            price: req.body.price,
            price_per: req.body.price_per,
            space_type: req.body.space_type,
            title: req.body.title,
            description: req.body.description,
            lat: req.body.lat,
            lng: req.body.lng,
            services: req.body.services
        }
        const result = await ads.create(res.locals.user, req.files as unknown as string[], ad);
        if (result.includes('successfully'))
            res.json({ Message: result, Flag: true });
        else
            res.json({ Message: result, Flag: false }).status(301);
    } catch (e) {
        console.log('Error in create function in ads.controller');
        throw e;
    }
}