import {v2 as cloudinary} from 'cloudinary';

const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_CLOUD_KEY, CLOUDINARY_CLOUD_SECRET_KEY} = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_CLOUD_KEY,
    api_secret: CLOUDINARY_CLOUD_SECRET_KEY
});

export default cloudinary;