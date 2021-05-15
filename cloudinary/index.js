const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.apiKey,
    api_secret: process.env.apiSecret,
})
const storage = new CloudinaryStorage ({
    cloudinary,
    params:{
    folder: 'Hadith',
  allowed_formats: ['jpeg','png','JPG']
}
})

module.exports = {
    cloudinary,
    storage
}