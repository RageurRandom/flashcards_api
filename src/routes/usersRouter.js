import { Router } from 'express'
import { getAllUsers, getUser, deleteUser } from '../controller/usersController.js'
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js'
import { validateParams } from '../middleware/validationMiddleware.js'
import { userIdParamSchema } from '../models/user.js'

const router = Router()

router.get('/', authenticateToken, requireAdmin, getAllUsers)
router.get('/:id', authenticateToken, requireAdmin, validateParams(userIdParamSchema), getUser)
router.delete('/:id', authenticateToken, requireAdmin, validateParams(userIdParamSchema), deleteUser)


export default router