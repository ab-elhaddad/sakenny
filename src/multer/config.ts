import { config } from "../configuration/config";
import multer from "multer";

export const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (config.ENV === 'dev' || config.ENV === 'test')
            cb(null, 'src/images/');
        else
            cb(null, './images/');
    },
    filename: (_req, file, cb) => {
        //console.log(file);
        cb(null, Date.now() + '-' + file.originalname);
    }
});