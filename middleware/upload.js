import multer from 'multer';
import path from 'path';

const destination = path.resolve('temp')

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        // cb(null, file.originalname);
        const uniquePref = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniquePref}_${file.originalname}`;
        cb(null, filename);
    }
});

const limits = {
    fileSize: 1024 * 1024 * 4
}

const upload = multer({
    storage, 
    limits
});

export default upload;