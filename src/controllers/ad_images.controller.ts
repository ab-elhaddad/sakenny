import express from 'express';
import AdImages from '../models/ad_images.model';
import uploadImages from './functions/uploadImages';

const adImages = new AdImages();

export const deleteImage = async (req: express.Request, res: express.Response) => {
    const result = await adImages.deleteImage(req.body.ad_id, req.body.image_url, res.locals.user);

    if (result.Message.includes('successfully'))
        return res.json(result);
    else
        return res.json(result).status(301);
}

export const addImage = async (req: express.Request, res: express.Response) => {
    try {
        const url = (await uploadImages(req.files, 'Ads Images'))[0];
        const result = await adImages.addImage(req.body.ad_id, url, req.body.image_description);
        if (result.Message.includes('successfully'))
            return res.json(result);
        else
            return res.json(result).status(401);
    }
    catch (e) {
        console.log('Error in add mage in ad_images.controller\n', e);
        return res.json({ Message: "Something went wrong!" });
    }
}

export const _addImage = async (req: express.Request, res: express.Response) => {
    try {
        const url = (await uploadImages(req.files, 'Ads Images'))[0];
        const result = await adImages.addImage(req.body.ad_id, url, req.body.description);
        if (result.Flag)
            return res.json(result);
        else
            return res.json(result).status(401);
    }
    catch (e) {
        console.log('Error in _addImage in ad_images.controller\n', e);
        return res.json({ Flag: false });
    }
}

export const _deleteImage = async (req: express.Request, res: express.Response) => {
    try {
        const result = await adImages._deleteImage(req.body.url);
        if (result.Flag)
            return res.json(result);
        else
            return res.json(result).status(401);
    }
    catch (e) {
        console.log('Error in _deleteImage in ad_images.controller\n', e);
        return res.json({ Flag: false });
    }
}