import { Router } from 'express'
import {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import auth from '../middlewares/auth'
import { validatePatchUser, validateLoginUser, validateRegisterUser } from '../middlewares/validations'

const authRouter = Router()

authRouter.get('/user', auth, getCurrentUser)
authRouter.patch('/me', validatePatchUser, auth, updateCurrentUser)
authRouter.get('/user/roles', validatePatchUser, auth, getCurrentUserRoles)
authRouter.post('/login', validateLoginUser, login)
authRouter.get('/token', refreshAccessToken)
authRouter.get('/logout', logout)
authRouter.post('/register', validateRegisterUser, register)

export default authRouter
