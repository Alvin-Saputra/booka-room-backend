import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'booka-room',
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

const deleteImageByUrl = async (url) => {
    if (!url) return null;
    try{
        const parts = url.split('/upload');
        if(parts.length < 2) return null;

        const remaining =  parts[1].replace(/^v\d+\//,'');

        const publicId = remaining.split('.')[0];

        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    }
    catch(error){
        console.error("Gagal menghapus gambar lama dari cludinary", error);


    }
}

export { upload, uploadToCloudinary, deleteImageByUrl };