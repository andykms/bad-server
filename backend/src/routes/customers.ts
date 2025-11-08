import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth from '../middlewares/auth'
import { getCustomerValidation, validatePatchUser } from '../middlewares/validations'
import { roleGuardMiddleware } from '../middlewares/auth'
import { Role } from '../models/user'

const customerRouter = Router()

customerRouter.get('/', getCustomerValidation, auth, roleGuardMiddleware(Role.Admin), getCustomers)
customerRouter.get('/:id', auth, roleGuardMiddleware(Role.Admin), getCustomerById)
customerRouter.patch('/:id', validatePatchUser, auth, roleGuardMiddleware(Role.Admin), updateCustomer)
customerRouter.delete('/:id', auth, roleGuardMiddleware(Role.Admin), deleteCustomer)

export default customerRouter
