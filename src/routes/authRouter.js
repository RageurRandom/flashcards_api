import { Router } from 'express'
import { loginUser, registerUser, getMe } from '../controller/authController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'


const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser) 
router.get('/me', authenticateToken, getMe)

export default router
