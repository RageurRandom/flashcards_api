import { Router } from 'express'
import { reviseCard } from '../controller/revisingsController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = Router()

router.post("/:card_id", authenticateToken, reviseCard)

export default router