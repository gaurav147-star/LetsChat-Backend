const cloudinary = require("cloudinary").v2
const dotenv = require("dotenv");
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY
});


// cloudinary.config({ 
//     cloud_name: 'djn1nfuky', 
//     api_key: '865351637683893', 
//     api_secret: 'DJTTGc5dGQU-bmYUYBiyuhqdJhQ' 
// });
module.exports=cloudinary;