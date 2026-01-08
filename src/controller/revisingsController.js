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
    const { id } = req.params
    const result = await createRevising(id, 'a1db4fed-9652-4772-94af-7359125355f1') // correspond a l'id de bob, temporaire
    

    res.status(200).json(result)

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

        console.log("test, current revising = ", current_revising)

        if(!current_revising){
            console.log("if passé")
            const result = await createRevising(card_id, user_id)

            res.status(200).json({message: "card updated", data: result})

            return
        }

        const new_level = Math.min(current_revising.level + 1, 5)

        const updated_properties = { // new properties if found, else current
            level: new_level,
            last_revising_date: Date.now()
        }

        console.log("if pas passé")
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

async function createRevising(card_id, user_id){
    const res = await db.insert(revisings).values({
        cardId: card_id,
        userId: user_id,
        //lastRevisingDate: Date.now(),
        //createdAt: Date.now(),
        level: 1
    }).returning()

    return res
}