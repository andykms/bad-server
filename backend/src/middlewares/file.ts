import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { extname } from 'path'
import { isValidFilename } from '../utils/is-valid-filename'


type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(
            null,
            join(
                __dirname,
                process.env.UPLOAD_PATH_TEMP
                    ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                    : '../public'
            )
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, `${uuidv4()}${Date.now().toString()}${extname(file.originalname)}`)
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const options = {
    replacement: '_' 
};

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if(file.originalname.length > 128) {
        return cb(null, false);
    }
    if(!isValidFilename(file.originalname)) {
        return cb(null, false);
    }
    if (!types.includes(file.mimetype)) {
        return cb(null, false);
    }

    return cb(null, true)
}

const upload = multer({
    storage: storage,
    limits: {fileSize: 8000000},
    fileFilter
})


export default upload;
