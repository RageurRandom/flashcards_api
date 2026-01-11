import { Router } from "express"
import { getCard, createCard, patchCard,
    deleteCard, getFromCollection, getToRevise } from "../controller/cardsController.js"
import { authenticateToken } from "../middleware/authMiddleware.js"

const router = Router()

router.get('/:id', authenticateToken, getCard)
router.get('/from-collection/:id', authenticateToken, getFromCollection)
router.get('/from-collection/:id/to-revise', authenticateToken, getToRevise)
router.post('/', authenticateToken, createCard)
router.patch('/', authenticateToken, patchCard)
router.delete('/:id', authenticateToken, deleteCard)


export default router