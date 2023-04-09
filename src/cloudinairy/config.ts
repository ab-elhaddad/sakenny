import c from 'cloudinary';
const cloudinary = c.v2;

// Configuration 
cloudinary.config({
    cloud_name: "dlyguoemz",
    api_key: "394176944959173",
    api_secret: "Lpt4bLh9bOOc34fl1xybN3wfY3E"
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