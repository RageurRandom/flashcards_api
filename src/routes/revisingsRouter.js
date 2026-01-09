import { Router } from 'express'
import { reviseCard } from '../controller/revisingsController.js'


const router = Router()

router.post("/:card_id", reviseCard)

export default router