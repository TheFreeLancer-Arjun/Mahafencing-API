const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

// ✅ Cloudinary storage with dynamic resource_type
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';

    return {
      folder: 'banner-images',
      resource_type: isPDF ? 'raw' : 'image', // ✅ this works directly!
      format: isPDF ? 'pdf' : undefined,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      access_mode: 'public',
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
