import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join, extname } from 'path'
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from 'uuid'
import { isValidFilename } from '../utils/is-valid-filename'
import BadRequestError from '../errors/bad-request-error'

// В middleware добавьте проверку
import { existsSync, mkdirSync } from 'fs'

const getUploadPath = () => {
    const path = process.env.UPLOAD_PATH_TEMP 
        ? join(__dirname, `../public/${process.env.UPLOAD_PATH_TEMP}`)
        : join(__dirname, '../public/temp');
    
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
    }
    return path;
}

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
            getUploadPath()
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(
            null,
            `${uuidv4()}${extname(file.originalname)}`
        )
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if(file.size < 2048) {
        return cb(new BadRequestError(""));
    }

    if (file.originalname.length > 2048) {
        return cb(new BadRequestError(''))
    }
    if (!isValidFilename(file.originalname)) {
        return cb(new BadRequestError(''))
    }
    if (!types.includes(file.mimetype)) {
        return cb(new BadRequestError(''))
    }

    return cb(null, true)
}

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
})

export default upload
