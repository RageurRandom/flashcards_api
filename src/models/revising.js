import { z } from "zod";

export const createRevisingSchema = z.object({
    cardId: z.string().min(1, "Card ID is required"),
    userId: z.string().min(1, "User ID is required"),
    level: z.number().min(1, "Level must be at least 1").max(5, "Level must be at most 5").optional(),
    lastRevisingDate: z.number().min(0, "Last Revising Date must be at least 0").optional(),
});

export const reviseCardSchema = z.object({
});

export const reviseCardParamSchema = z.object({
    card_id: z.uuid("Invalid Card ID"),
});

export const daysUntilNextRevising = (level) => {
    return 2 ** (level - 1)
}