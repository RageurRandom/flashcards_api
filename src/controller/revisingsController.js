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
        const user_id = req.user.userId
        const { card_id } = req.params
        
        const [current_revising] = await db.select().from(revisings).where(and(eq(card_id, revisings.cardId), eq(user_id, revisings.userId)))

        if(!current_revising){
            const result = await createRevising(card_id, user_id)

            res.status(200).json({message: "card updated", data: result})

            return
        }

        const current_level = current_revising.level | 0
        const new_level = Math.min(current_revising.level + 1, 5)

        const updated_properties = {
            level: new_level,
            last_revising_date: Date.now() //TODO check if time is properly updated
        }

        const [revising] = await db.update(revisings)
        .set(updated_properties)
        .where(and(eq(card_id, revisings.cardId), eq(user_id, revisings.userId)))
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
    const now = Date.now()
    const res = await db.insert(revisings).values({
        cardId: card_id,
        userId: user_id,
        lastRevisingDate: now,
        level: 1
    }).returning()

    return res
}