import cloudinary from '../../cloudinairy/config';
import fs from 'fs';

const storeImages = async (images: string[], folder: string): Promise<string[]> => {
    if (images.length === 0)
        return images;
    let urls: string[] = [];

    for (const image of images) {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            folder: folder,
            transformation: [
                { width: 1000, crop: "scale" },
                { quality: "auto" },
                { fetch_format: "auto" }
            ]
        }

        const res = await cloudinary.uploader.upload(image, options);
        fs.rmSync(image);

        console.log(res);
        urls.push(res.secure_url);
    }

    return urls;
}

export default storeImages;