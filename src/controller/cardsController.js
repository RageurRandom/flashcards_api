import { db } from "../db/database.js"
import { and, eq } from "drizzle-orm"
import { request,response } from "express"
import { cards, revisings, collections } from "../db/schema.js"
import { daysUntilNextRevising } from "../models/revising.js"
import { canAccessCard } from "../models/card.js"
import { canAccessCollection } from "../models/collections.js"



/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const getCard = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id);
        if(!await canAccessCard(id, req.user)){
            return res.status(401).send({error : "Access to card forbidden"})
        }

        const [result] = await db.select().from(cards).where(eq(id, cards.id))

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

        if(!await isCardOwner(id, req.user)){
            return res.status(401).send({error : "Access to card forbidden"})
        }

        const [current_card] = await db.select().from(cards).where(eq(id, cards.id))


        const updated_properties = { // new properties if found, else current
            recto: req.body.recto || current_card.recto,
            verso: req.body.verso || current_card.verso,
            rectoUrl: req.body.recto_url || current_card.recto_url,
            versoUrl: req.body.verso_url || current_card.verso_url
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
        const { collectionId } = req.body

        const [collection] = await db.select().from(collections).where(eq(collectionId, collections.id))

        if(collection.creatorId !== req.user.userId && req.user.role !== 'admin'){
            return res.status(401).send({error : "You can't add card to this collection"})
        }

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
        console.log("not done")
        if(!await isCardOwner(id, req.user)){
            return res.status(401).send({error : "Access to card forbidden"})
        }
        
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

        const [collection] = await db.select().from(collections).where(eq(id, collections.id))

        if(! canAccessCollection(collection, req.user)){
            return res.status(401).send({error : "You can't access cards from this collection"})
        }

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
        const user = req.user

    const [collection] = await db.select().from(collections).where(eq(id, collections.id))

        if(! canAccessCollection(collection, req.user)){
            return res.status(401).send({error : "You can't access cards from this collection"})
        }

        const rows = await db.select().from(cards)
        .innerJoin(revisings, eq(revisings.cardId, cards.id))
        .where(and(
            eq(id, cards.collectionId),
            eq(user.userId, revisings.userId)
        ))

        const result = rows.filter((row) => {
            
            const time_since_last_revising = Date.now() - row.revising.lastRevisingDate
            const days_since_last_revising = time_since_last_revising / (1000 * 3600 * 24)

            return days_since_last_revising >= daysUntilNextRevising(row.revising.level)
        }).map((row) => row.cards)
        

        res.status(200).json(result)
    } catch (error) {
        console.error(error)

        res.status(500).send({error : "Failed to querry cards"})
    }
}

async function isCardOwner(card_id, user) {
    const [result] = await db
        .select({ ownerId: collections.creatorId })
        .from(cards)
        .innerJoin(collections, eq(collections.id, cards.collectionId))
        .where(eq(cards.id, card_id));

    const owner_id = result?.ownerId;

    return user.role === 'admin' || user.userId === owner_id;
}