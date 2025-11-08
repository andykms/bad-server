import { Router } from 'express'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { validateOrderBody, getOrdersCurrentUserValidation, getOrdersValidation, validationOrderByNumber, validateProductUpdateBody } from '../middlewares/validations'
import { Role } from '../models/user'

const orderRouter = Router()

orderRouter.post('/', auth, validateOrderBody, createOrder)
orderRouter.get('/all', getOrdersValidation, auth, getOrders)
orderRouter.get('/all/me', getOrdersCurrentUserValidation, auth, getOrdersCurrentUser)
orderRouter.get(
    '/:orderNumber',
    auth,
    validationOrderByNumber,
    roleGuardMiddleware(Role.Admin),
    getOrderByNumber
)
orderRouter.get('/me/:orderNumber', auth, validationOrderByNumber, getOrderCurrentUserByNumber)
orderRouter.patch(
    '/:orderNumber',
    validateProductUpdateBody,
    auth,
    auth,
    roleGuardMiddleware(Role.Admin),
    updateOrder
)

orderRouter.delete('/:id', auth, roleGuardMiddleware(Role.Admin), deleteOrder)

export default orderRouter
