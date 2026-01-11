import { Router } from "express"
import { getCard, createCard, patchCard,
    deleteCard, getFromCollection, getToRevise } from "../controller/cardsController.js"
import { validateBody, validateParams } from "../middleware/validationMiddleware.js"
import { createCardSchema, patchCardSchema, cardIdParamSchema } from "../models/card.js"
import { collectionIdParamSchema } from "../models/collections.js"
import { authenticateToken } from "../middleware/authMiddleware.js"



const router = Router()

router.get('/:id', authenticateToken, validateParams(cardIdParamSchema), getCard)
router.get('/from-collection/:id', authenticateToken, validateParams(collectionIdParamSchema), getFromCollection)
router.get('/from-collection/:id/to-revise', authenticateToken, validateParams(collectionIdParamSchema), getToRevise)
router.post('/', authenticateToken, validateBody(createCardSchema), createCard)
router.patch('/', authenticateToken, validateBody(patchCardSchema), patchCard)
router.delete('/:id', authenticateToken, validateParams(cardIdParamSchema), deleteCard)


export default router