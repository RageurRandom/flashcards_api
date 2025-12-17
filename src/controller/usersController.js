import { request, response } from "express"
import { db } from "../db/database.js"
import { users } from "../db/schema.js"
import { eq } from "drizzle-orm"


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const getUser = async (req, res)=>{
    const { id } = req.params;

    try {
        const [user] = await db.select().from(users).where(eq(users.id, id));

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({error});
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
        const result = await db.select().from(users).orderBy(users.name);

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const deleteUser = async (req, res)=>{
    const { id } = req.params;

    try {
        const deleteCount = await db.delete(users).where(eq(users.id, id));
        if (deleteCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

}