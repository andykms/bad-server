// middlewares/csrf.ts
/*import csurf from 'csurf'
import { Request, Response, NextFunction } from 'express'

export const csrfProtection = csurf({
    cookie: {
        key: '_csrf',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    },
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
})

export const sendCsrfToken = (req: Request, res: Response, _: NextFunction) => {
    res.send({ csrfToken: req.csrfToken() })
}
*/