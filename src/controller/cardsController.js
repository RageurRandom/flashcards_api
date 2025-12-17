import { db } from "../db/database.js"
import { eq } from "drizzle-orm"
import { request,response } from "express"
import { cards } from "../db/schema.js"


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
            verso_url: req.body.verso_url || current_card.verso_url,
            collection_id: req.body.collection_id || current_card.collection_id
        }

        const [card] = await db.update(cards)
        .set(updated_properties)
        .where(eq(id, cards.id))
        .returning()

        if(!card){
            return res
        }

        res.status(200).json({message: "question updated", data: card})
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
    res.status(201).send({message : "WIP"})
    //TODO
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