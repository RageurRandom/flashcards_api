import { Router } from "express"
import { getCard, createCard, patchCard, deleteCard } from "../controller/cardsController.js"

const router = Router()

router.get('/:id', getCard)
router.post('/', createCard)
router.patch('/:id', patchCard)
router.delete('/:id', deleteCard)

export default router