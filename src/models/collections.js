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

export const patchCollectionSchema = z.object({
    id: z.uuid("Invalid Collection ID"),
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    isPublic: z.boolean().optional(),
});

export const collectionIdParamSchema = z.object({
    id: z.uuid("Invalid Collection ID"),
});

export const searchCollectionParamSchema = z.object({
    querry: z.string().trim().min(1, "Query is required"),
});
