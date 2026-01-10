import { Router } from "express"
import { getCard, createCard, patchCard,
    deleteCard, getFromCollection, getToRevise } from "../controller/cardsController.js"
import { validateBody, validateParams } from "../middleware/validationMiddleware.js"
import { createCardSchema, patchCardSchema, cardIdParamSchema } from "../models/card.js"
import { collectionIdParamSchema } from "../models/collections.js"

const router = Router()

router.get('/:id', validateParams(cardIdParamSchema), getCard)
router.get('/from-collection/:id', validateParams(collectionIdParamSchema), getFromCollection)
router.get('/from-collection/:id/to-revise', validateParams(collectionIdParamSchema), getToRevise)
router.post('/', validateBody(createCardSchema), createCard)
router.patch('/', validateBody(patchCardSchema), patchCard)
router.delete('/:id', validateParams(cardIdParamSchema), deleteCard)


export default router