import { Router } from "express"
import { getCard, createCard, patchCard, deleteCard } from "../controller/cardsController.js"

const router = Router()

router.get('/:id', getCard)
router.post('/', createCard)
router.patch('/', patchCard)
router.delete('/', deleteCard)

export default router