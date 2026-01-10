import { Router } from "express"
import { getCollection, searchCollections, createCollection,
    deleteCollection, getMyCollections, patchCollection } from "../controller/collectionsController.js"
import { authenticateToken } from "../middleware/authMiddleware.js"


const router = Router()


router.get('/:id', authenticateToken, getCollection)
router.get('/', authenticateToken, getMyCollections)
router.get('/search/:querry', authenticateToken, searchCollections)
router.post('/', authenticateToken, createCollection)
router.patch('/', authenticateToken, patchCollection)
router.delete('/:id', authenticateToken, deleteCollection)


export default router