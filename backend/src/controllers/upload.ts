import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import { MIN_IMAGE_SIZE } from '../config'
import { extname } from 'path'
import { unlink } from 'fs/promises'
import { isValidImageSignature, isValidSVG } from '../utils/file-signature-check'

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]


export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }

    if(!req.file.path) {
        return next(new BadRequestError("неизвестный путь"))
    }

    if(req.file.size < MIN_IMAGE_SIZE) {
        await unlink(req.file.path);
        return next(new BadRequestError(''))
    }

    if(!types.includes(req.file.mimetype)) {
        return next(new BadRequestError('неверные типы'))
    }

    if(!types.map((type)=>`.${type.split("/")[1]}`).includes(extname(req.file.path))) {
        return next(new BadRequestError("неверный формат"))
    }

    const isValidSignature = await isValidImageSignature(req.file.path);

    let isActuallyValidImage = isValidSignature;
    if (!isValidSignature && req.file.mimetype === 'image/svg+xml') {
      isActuallyValidImage = await isValidSVG(req.file.path);
    }

    if (!isActuallyValidImage) {
      await unlink(req.file.path);
      return next(new BadRequestError('Файл не является корректным изображением'));
    }


    try {
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/images/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
