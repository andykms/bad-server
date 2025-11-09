import { Router } from 'express'
import { csrfProtection, sendCsrfToken } from '../middlewares/csrf'

const csrfRouter = Router()
csrfRouter.get('/', csrfProtection, sendCsrfToken)

export default csrfRouter
