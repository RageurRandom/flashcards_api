import { Router } from 'express'
import { loginUser, registerUser } from '../controller/authController.js'


const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser) 
//TODO route to get user info

export default router