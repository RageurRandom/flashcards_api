import { Router } from "express"
import { getCollection, searchCollections, createCollection, deleteCollection, getMyCollections, patchCollection } from "../controller/collectionsController.js"


const router = Router()


router.get('/:id', getCollection)
router.get('/', getMyCollections)
//TODO searchCollection route
router.post('/', createCollection)
router.patch('/', patchCollection)
router.delete('/:id', deleteCollection)


export default router