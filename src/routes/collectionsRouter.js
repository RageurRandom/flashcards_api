import { Router } from "express"
import { getCollection, searchCollections, createCollection,
    deleteCollection, getMyCollections, patchCollection } from "../controller/collectionsController.js"
import { validateBody, validateParams } from "../middleware/validationMiddleware.js"
import { createCollectionSchema, patchCollectionSchema, collectionIdParamSchema, searchCollectionParamSchema } from "../models/collections.js"
import { authenticateToken } from '../middleware/authMiddleware.js'


const router = Router()


router.get('/:id', validateParams(collectionIdParamSchema), getCollection)
router.get('/', authenticateToken, getMyCollections)
router.get('/search/:querry', validateParams(searchCollectionParamSchema), searchCollections)
router.post('/', authenticateToken, validateBody(createCollectionSchema), createCollection)
router.patch('/', validateBody(patchCollectionSchema), patchCollection)
router.delete('/:id', validateParams(collectionIdParamSchema), deleteCollection)


export default router