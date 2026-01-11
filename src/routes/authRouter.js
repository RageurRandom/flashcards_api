import { Router } from 'express'
import { loginUser, registerUser, getMe } from '../controller/authController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { validateBody } from '../middleware/validationMiddleware.js'
import { createUserSchema, loginUserSchema } from '../models/user.js'


const router = Router()

router.post('/register', validateBody(createUserSchema), registerUser)
router.post('/login', validateBody(loginUserSchema), loginUser) 
router.get('/me', authenticateToken, getMe)

export default router
