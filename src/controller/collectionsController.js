import { db } from "../db/database.js"
import { eq } from "drizzle-orm"
import { request,response } from "express"
import { collections } from "../db/schema.js"


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const getCollection = async (req, res) => {
    try {
        const { id } = req.params

        const result = await db.select().from(collections).where(eq(id, collections.id))
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
        const result = await db.select().from(collections) // TODO select only collections created by the user
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
        const result = await db.insert(collections).values(req.body).returning() // TODO l'id user ne doit pas etre renseigné

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
            const { id } = req.params
            
            const result = await db.delete(collections).where(eq(id, collections.id)).returning()
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
    res.status(201).send({message : "WIP"})
    //TODO
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
        
        const current_collection = db.select().from(collections).where(eq(id, collections.id))

        const updated_properties = { // new properties if found, else current
            title: req.body.title || current_collection.title,
            description: req.body.description || current_collection.description,
            is_public: req.body.is_public || current_collection.is_public
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