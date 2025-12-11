import express from 'express'
import cardRouter from './routes/cardsRouter.js'
import collectionRouter from './routes/collectionsRouter.js'
import authRouter from './routes/authRouter.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use('/cards', cardRouter)
app.use('/collections', collectionRouter)
app.use('/auth', authRouter)

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})