import express from 'express';
import AdImages from '../routes/api/ad_images.model';

const adImages = new AdImages();

export const deleteImage = async (req: express.Request, res: express.Response) => {
    const result = await adImages.deleteImage(req.body.ad_id, req.body.image_url, res.locals.user);

    if (result.Message.includes('successfully'))
        return res.json(result);
    else
        return res.json(result).status(301);
}