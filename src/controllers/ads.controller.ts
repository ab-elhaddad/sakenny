import express from 'express';
import Ads from '../models/ads.model';

const ads = new Ads();

export const getAll = async (_req: express.Request, res: express.Response) => {
    try {
        const result = await ads.getAll();
        res.json({ Message: 'Data retrieved successfully', Flag: true, ...result });
    }
    catch (e) {
        console.log('Error in getAll function in ads.controller');
        throw e;
    }
}