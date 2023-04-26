import multer from "multer";

export const allowedExtensions = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    file: ['application/pdf', 'application/msword'],
    video: ['video/mp4']
}

export const fileUpload = (validation = allowedExtensions.image) => {
    const storage = multer.diskStorage({});
    const fileFilter = (req, file, cb) => {
        if(validation.includes(file.mimetype)){
            return cb(null, true)
        }
        return cb('In-valid file format', false)
    }
    const upload = multer({fileFilter, storage})
    return upload;
}