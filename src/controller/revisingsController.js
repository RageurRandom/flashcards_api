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
export const reviseCard = async (req, res) => {
    try {
        const { userId } = req.user //TODO change for the user's id, not the one put in the body
        const { card_id } = req.params
        
        const [current_revising] = await db.select().from(revisings).where(and(eq(card_id, revisings.cardId), eq(userId, revisings.userId)))

        if(!current_revising){
            const result = await createRevising(card_id, userId)

            res.status(200).json({message: "card updated", data: result})

            return
        }

        const current_level = current_revising.level | 0
        const new_level = Math.min(current_level + 1, 5)

        const updated_properties = {
            level: new_level,
            lastRevisingDate: Date.now() //TODO check if time is properly updated
        }

        const [revising] = await db.update(revisings)
        .set(updated_properties)
        .where(and(eq(card_id, revisings.cardId), eq(userId, revisings.userId)))
        .returning()

        if(!revising){
            return res
        }

        res.status(200).json({message: "card updated", data: revising})
    } catch (error) {
        console.log(error)

        res.status(500).send({error : "Failed to create or patch revising"})
    }
}

async function createRevising(card_id, user_id){ 
    const res = await db.insert(revisings).values({
        cardId: card_id,
        userId: user_id,
        lastRevisingDate: Date.now(),
        level: 1
    }).returning()

    return res
}