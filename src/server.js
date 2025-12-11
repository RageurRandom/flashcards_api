import express from 'express'
import cardRouter from './routes/cardsRouter.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use('/cards', cardRouter)

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})