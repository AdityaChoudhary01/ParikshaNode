import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// --- START: Debugging Logs ---
console.log('--- Loading Cloudinary Config ---');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Loaded' : 'MISSING or EMPTY');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Loaded' : 'MISSING or EMPTY');
// We check for the secret's existence without printing its value for security.
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'MISSING or EMPTY');
console.log('---------------------------------');
// --- END: Debugging Logs ---

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'proquiz_avatars',
    allowed_formats: ['jpeg', 'png', 'jpg'],
    transformation: [{ width: 200, height: 200, crop: 'fill' }]
  },
});

const upload = multer({ storage: storage });

export default upload;