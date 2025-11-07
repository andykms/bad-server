import { csrfProtection, sendCsrfToken } from '../middlewares/csrf'
import { Router } from 'express'

const csrfRouter = Router()
csrfRouter.get('/', csrfProtection, sendCsrfToken)

export default csrfRouter
