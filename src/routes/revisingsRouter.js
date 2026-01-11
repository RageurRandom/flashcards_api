import { Router } from 'express'
import { reviseCard } from '../controller/revisingsController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { validateBody, validateParams } from '../middleware/validationMiddleware.js'
import { reviseCardSchema, reviseCardParamSchema } from '../models/revising.js'


const router = Router()

router.post("/:card_id", authenticateToken, validateParams(reviseCardParamSchema), validateBody(reviseCardSchema), reviseCard)

export default router