import { z } from "zod";
import { canAccessCollection } from "./collections.js";
import { db } from "../db/database.js";
import { cards, collections } from "../db/schema.js"
import { eq } from "drizzle-orm"

export const createCardSchema = z.object({
    recto: z.string().min(1, "Recto is required"),
    verso: z.string().min(1, "Verso is required"),
    rectoUrl: z.string().url("Recto URL must be a valid URL").optional().or(z.literal("")),
    versoUrl: z.string().url("Verso URL must be a valid URL").optional().or(z.literal("")),
    collectionId: z.string().min(1, "Collection ID is required"),
});

/**
 * 
 * @param {String} card_id 
 * @param user 
 * @returns {boolean}
 */
export const canAccessCard = async (card_id, user)=> {
    const [row] = await db.select().from(cards)
                .where(eq(card_id, cards.id))
                .innerJoin(collections, eq(cards.collectionId, collections.id))

    console.log(row);
    return canAccessCollection(row.collections, user)
};