import { Router } from 'express'
import { getAllUsers, getUser, deleteUser } from '../controller/usersController.js'

const router = Router()

router.get('/', getAllUsers)
router.get('/:id', getUser)
router.delete('/', deleteUser)


export default router