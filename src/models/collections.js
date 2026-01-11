import { z } from "zod";
import { collections } from "../db/schema.js";

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
    return collection.isPublic === 1 || collection.creatorId == user.userId || user.role === "admin"
}