import { z } from "zod";
import { db } from "../db/database";
import { collections } from "../db/schema";
import { eq } from "drizzle-orm";

export const createCollectionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    isPublic: z.boolean().optional(),
});


export const canAccessCollection = async (col_id, user_id)=> {
    const [collection] = await db.select().from(collections).where(eq(collections.id, col_id))
    return collection.isPublic === 1 || collection.creatorId === user_id
}