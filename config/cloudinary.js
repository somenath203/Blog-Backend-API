const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});


const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    allowedFormat: ['jpg', 'png'],
    params: {
        folder: 'blog-api-backend',
        transformation: [{ width: 500, height: 500, crop: 'limit' }] 
    }
});



module.exports = cloudinaryStorage;

