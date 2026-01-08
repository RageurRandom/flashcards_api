import { Router } from 'express'
import { reviseCard, patchRevising } from '../controller/revisingsController.js'


const router = Router()

router.post('/:id', reviseCard)
router.patch('/', patchRevising)

export default router