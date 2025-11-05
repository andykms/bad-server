import type { Request, Response, NextFunction } from 'express'
import DOMPurify from 'isomorphic-dompurify'

export const bodyXssValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const body = req.body
    const stack = [body]
    try {
        while (stack.length > 0) {
            const currObj = stack.pop()
            if (Array.isArray(currObj)) {
                currObj.forEach((item, index) => {
                    if (typeof item === 'string') {
                        currObj[index] = DOMPurify.sanitize(item)
                    } else if (typeof item === 'object') {
                        stack.push(item)
                    }
                })
                continue
            }
            const keys = Object.keys(currObj)
            keys.forEach((key) => {
                if (typeof currObj[key] === 'string') {
                    currObj[key] = DOMPurify.sanitize(currObj[key])
                } else if (typeof currObj[key] === 'object') {
                    stack.push(currObj[key])
                }
            })
        }
    } catch (err) {
        next(500)
    }
    req.body = body
    next()
}
