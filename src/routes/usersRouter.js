import { Router } from 'express'
import { getAllUsers, getUser, deleteUser } from '../controller/usersController.js'
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', authenticateToken, requireAdmin, getAllUsers)
router.get('/:id', authenticateToken, requireAdmin, getUser)
router.delete('/:id', authenticateToken, requireAdmin, deleteUser)


export default router