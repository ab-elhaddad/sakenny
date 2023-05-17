import multer from "multer";
import path from 'path';

export const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        //console.log(file);
        cb(null, Date.now() + '-' + file.originalname);
    }
});