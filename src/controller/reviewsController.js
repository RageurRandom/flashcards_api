import { request, response } from "express"
import { db } from "../db/database.js"
import { revisings } from "../db/schema.js"
import { and, eq } from "drizzle-orm"


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const reviewCard = async (req, res) => {
    res.status(200).send("WIP")

    //TODO
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const patchRevising = async (req, res) => {
    try {
        const { card_id, user_id } = req.body
        
        const current_revising = db.select().from(revisings).where(and(eq(card_id, revisings.cardId), eq(user_id, revisings.userId)))

        const updated_properties = { // new properties if found, else current
            level: req.body.level | current_revising.level,
            last_revising_date: Date.now()
        }

        const [revising] = await db.update(revisings)
        .set(updated_properties)
        .where(and(eq(card_id, revisings.cardId), eq(user_id, revisings.userId)))
        .returning()

        if(!revising){ // TODO doesn't work
            return res
        }

        res.status(200).json({message: "card updated", data: revising})
    } catch (error) {
        console.log(error)

        res.status(500).send({error : "Failed to patch revising"})
    }
}