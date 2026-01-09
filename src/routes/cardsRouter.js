import { Router } from "express"
import { getCard, createCard, patchCard,
    deleteCard, getFromCollection, getToRevise } from "../controller/cardsController.js"

const router = Router()

router.get('/:id', getCard)
router.get('/from-collection/:id', getFromCollection)
router.get('/from-collection/:id/to-revise', getToRevise)
router.post('/', createCard)
router.patch('/', patchCard)
router.delete('/:id', deleteCard)


export default router