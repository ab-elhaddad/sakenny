import { config } from "../configuration/config";
import multer from "multer";

export const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (config.ENV === 'prod')
            cb(null, '/images');
        else
            cb(null, 'src/images/');
    },
    filename: (_req, file, cb) => {
        //console.log(file);
        cb(null, Date.now() + '-' + file.originalname);
    }
});