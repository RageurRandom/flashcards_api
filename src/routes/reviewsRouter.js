import { Router } from 'express'
import { reviewCard, patchRevising } from '../controller/reviewsController.js'


const router = Router()

router.post('/:id', reviewCard)
router.patch('/', patchRevising)

export default router