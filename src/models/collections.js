import { z } from "zod";
import { db } from "../db/database.js";
import { collections, users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const createCollectionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    isPublic: z.boolean().optional(),
});

/**
 * 
 * @param {collections} collection 
 * @param user
 * @returns {boolean}
 */
export const canAccessCollection = (collection, user)=> {
    //console.log(`public : ${collection.isPublic === 1}\ncollection.creatorId === user.userId : ${collection.creatorId == user.userId}\nuser.role === "admin : ${user.role === "admin"}`)
    return collection.isPublic === 1 || collection.creatorId == user.userId || user.role === "admin"
}