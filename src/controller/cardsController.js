import { db } from "../db/database.js"
import { and, eq, gte } from "drizzle-orm"
import { request,response } from "express"
import { cards, collections, revisings } from "../db/schema.js"
import { daysUntilNextRevising } from "../models/revising.js"



/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const getCard = async (req, res) => {
    try {
        const { id } = req.params

        const result = await db.select().from(cards).where(eq(id, cards.id))
        res.status(200).json(result)
    } catch (error) {
        console.error(error)

        res.status(500).send({error : "Failed to querry cards"})
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const patchCard = async (req, res) => {
    try {
        const { id } = req.body
        
        const current_card = db.select().from(cards).where(eq(id, cards.id))

        const updated_properties = { // new properties if found, else current
            recto: req.body.recto || current_card.recto,
            verso: req.body.verso || current_card.verso,
            recto_url: req.body.recto_url || current_card.recto_url,
            verso_url: req.body.verso_url || current_card.verso_url
        }

        const [card] = await db.update(cards)
        .set(updated_properties)
        .where(eq(id, cards.id))
        .returning()

        if(!card){
            return res
        }

        res.status(200).json({message: "card updated", data: card})
    } catch (error) {
        console.log(error)

        res.status(500).send({error : "Failed to patch card"})
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const createCard = async (req, res) => {
    try {
        const result = await db.insert(cards).values(req.body).returning()

        res.status(201).json({message:"Card successfully created", data: result})
    } catch (error) {
        console.log(error)

        res.status(500).send({error : "Failed to create card"})
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const deleteCard = async (req, res) => {
    try {
        const { id } = req.params
        
        const result = await db.delete(cards).where(eq(id, cards.id)).returning()
        res.status(201).json({message:"Card successfully deleted", data: result})
    } catch (error) {
        console.log(error)

        res.status(500).send({error : "Failed to delete card"})
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const getFromCollection = async (req, res) => {
    try {
        const { id } = req.params

        const result = await db.select().from(cards).where(eq(id, cards.collectionId))
        res.status(200).json(result)
    } catch (error) {
        console.error(error)

        res.status(500).send({error : "Failed to querry cards"})
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const getToRevise = async (req, res) => {
    try {
        const { id } = req.params

        const rows = await db.select().from(cards)
        .where(eq(id, cards.collectionId)) 
        .innerJoin(revisings, eq(revisings.cardId, cards.id)) //TODO add user

        const result = rows.filter((row) => {
            
            const time_since_last_revising = Date.now() - row.revising.lastRevisingDate
            const days_since_last_revising = time_since_last_revising / (1000 * 3600 * 24)

            console.log(`jours depuis révision : ${days_since_last_revising}\ndate de dernière révision : ${new Date(row.revising.lastRevisingDate)}\n jours avant prochaine révision : ${daysUntilNextRevising(row.revising.level)}`)

            return days_since_last_revising >= daysUntilNextRevising(row.revising.level)
        }).map((row) => row.cards)
        

        res.status(200).json(result)
    } catch (error) {
        console.error(error)

        res.status(500).send({error : "Failed to querry cards"})
    }
}