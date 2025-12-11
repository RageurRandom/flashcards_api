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
    res.status(200).send({message : "WIP"})
    //TODO
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
    res.status(201).send({message : "WIP"})
    //TODO
}