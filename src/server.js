import express from 'express'
import cardRouter from './routes/cardsRouter.js'
import collectionRouter from './routes/collectionsRouter.js'
import authRouter from './routes/authRouter.js'
import userRouter from './routes/usersRouter.js'
import reviewRouter from './routes/revisingsRouter.js'
import { authenticateToken } from './middleware/authMiddleware.js'


const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())


app.use('/cards', authenticateToken, cardRouter)
app.use('/collections', authenticateToken, collectionRouter)
app.use('/auth', authRouter)
app.use('/revisings', authenticateToken, reviewRouter)
app.use('/users',authenticateToken, userRouter) //TODO add middleware to require admin privileges to use this route


app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})