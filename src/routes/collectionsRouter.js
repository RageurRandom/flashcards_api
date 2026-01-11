import { Router } from "express"
import { getCollection, searchCollections, createCollection,
    deleteCollection, getMyCollections, patchCollection } from "../controller/collectionsController.js"
import { authenticateToken } from "../middleware/authMiddleware.js"
import { validateBody, validateParams } from "../middleware/validationMiddleware.js"
import { createCollectionSchema, patchCollectionSchema, collectionIdParamSchema, searchCollectionParamSchema } from "../models/collections.js"



const router = Router()


router.get('/:id', authenticateToken, validateParams(collectionIdParamSchema), getCollection)
router.get('/', authenticateToken, getMyCollections)
router.get('/search/:querry', authenticateToken, validateParams(searchCollectionParamSchema), searchCollections)
router.post('/', authenticateToken, validateBody(createCollectionSchema), createCollection)
router.patch('/', authenticateToken, validateBody(patchCollectionSchema), patchCollection)
router.delete('/:id', authenticateToken, validateParams(collectionIdParamSchema), deleteCollection)


export default router