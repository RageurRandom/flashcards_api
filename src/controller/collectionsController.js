import { db } from "../db/database.js"
import { and, eq, like, or, sql } from "drizzle-orm"
import { request,response } from "express"
import { collections } from "../db/schema.js"
import { canAccessCollection } from "../models/collections.js"


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const getCollection = async (req, res) => {
    try {
        const { id } = req.params

        const [result] = await db.select().from(collections).where(eq(id, collections.id))

        console.log(result, "\n=======\n", req.user)

        if(!canAccessCollection(result, req.user)){ //TODO check
            res.status(401).send({error:"You don't own this private collection"})
            return
        }

        res.status(200).json(result)
    } catch (error) {
        console.error(error)

        res.status(500).send({error : "Failed to querry collection"})
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const getMyCollections = async (req, res) => {
    try {
        const user = req.user

        const result = await db.select().from(collections).where(eq(collections.creatorId, user.userId))

        res.status(200).json(result)
    } catch (error) {
        console.error(error)

        res.status(500).send({error : "Failed to querry collection"})
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const createCollection = async (req, res) => {
    try {
        const user = req.user
        req.body.creatorId = user.userId

        const result = await db.insert(collections).values(req.body).returning()

        res.status(201).json({message:"Collection successfully created", data: result})
    } catch (error) {
        console.log(error)

        res.status(500).send({error : "Failed to create collection"})
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const deleteCollection = async (req, res) => {
    try {
            const user = req.user
            const { id } = req.params

            const [current_collection] = await db.select().from(collections).where(eq(id, collections.id))

            if(current_collection.creatorId !== user.userId && user.role !== 'admin'){
                res.status(401).send({error: "You don't own this collection"})

                return
            }
            
            const result = await db.delete(collections).where(eq(id, collections.id)).returning() //TODO
            res.status(201).json({message:"Collection successfully deleted", data: result})
        } catch (error) {
            console.log(error)
    
            res.status(500).send({error : "Failed to delete collection"})
        }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const searchCollections = async (req, res) => {
    const user = req.user
    const { querry } = req.params

    try{
        const rows = await db.select().from(collections).where(
            like( sql`lower(${collections.title})`, `%${querry.toLowerCase()}%`)
        )

        const result = rows.filter((collection)=> {
            return canAccessCollection(collection, user)
        })

        res.status(200).json(result)
    } catch(error){
        console.error(error)

        res.status(500).send({error : "Failed to querry collection"})
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const patchCollection = async (req, res) => {
    try {
        const { id } = req.body
        const user = req.user
        
        const [current_collection] = await db.select().from(collections).where(eq(id, collections.id))

        if(current_collection.creatorId !== user.userId && user.role !== 'admin'){
            res.status(401).send("You don't own this collection")

            return
        }


        // as is_public is a boolean, I can't process it like the other variables
        const new_is_public = req.body.is_public !== undefined ? (req.body.is_public ? 1 : 0) : current_collection.isPublic

        const updated_properties = { // new properties if found, else current
            title: req.body.title || current_collection.title,
            description: req.body.description || current_collection.description,
            isPublic: new_is_public
        }

        const [collection] = await db.update(collections)
        .set(updated_properties)
        .where(eq(id, collections.id))
        .returning()

        if(!collection){
            return res
        }

        res.status(200).json({message: "collection updated", data: collection})
    } catch (error) {
        console.log(error)

        res.status(500).send({error : "Failed to patch collection"})
    }
}