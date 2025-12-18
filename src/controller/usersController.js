import { db } from "../db/database.js"
import { eq } from "drizzle-orm"
import { request,response } from "express"
import { users } from "../db/schema.js"


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const getUser = async (req, res)=>{
    try {
        const { id } = req.params

        const result = await db.select().from(users).where(eq(id, users.id))
        res.status(200).json(result)
    } catch (error) {
        console.error(error)

        res.status(500).send({error : "Failed to querry user"})
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const getAllUsers = async (req, res)=>{
    try {
        const { id } = req.params

        const result = await db.select().from(users)
        res.status(200).json(result)
    } catch (error) {
        console.error(error)

        res.status(500).send({error : "Failed to querry user"})
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const deleteUser = async (req, res)=>{
    res.status(200).send({message : "WIP"})
    //TODO
}