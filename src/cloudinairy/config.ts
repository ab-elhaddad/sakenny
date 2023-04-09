import c from 'cloudinary';
import { config } from '../configuration/config';
const cloudinary = c.v2;

// Configuration 
cloudinary.config({
    cloud_name: config.cloudinairy_cloud_name,
    api_key: config.cloudinairy_api_key,
    api_secret: config.cloudinairy_api_secret
});

// Export
export default cloudinary;


// Upload
// const res = cloudinary.uploader.upload('../../imgs/2023-03.gif', { public_id: "olympic_flag" })

// res.then((data) => {
//     console.log(data);
//     console.log(data.secure_url);
// }).catch((err) => {
//     console.log(err);
// });


// Generate
// const url = cloudinary.url("olympic_flag", {
//     Crop: 'fill'
// });



// The output url
// console.log(url);