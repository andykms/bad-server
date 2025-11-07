// controllers/csrf.ts
import { Request, Response } from 'express'

export const getCsrfToken = (req: Request, res: Response) => {
    res.json({
        csrfToken: req.csrfToken(),
    })
}
