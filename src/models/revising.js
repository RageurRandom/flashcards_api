import { z } from "zod";

export const createRevisingSchema = z.object({
    cardId: z.string().min(1, "Card ID is required"),
    userId: z.string().min(1, "User ID is required"),
    level: z.number().min(1, "Level must be at least 1").max(5, "Level must be at most 5").optional(),
    lastRevisingDate: z.number().min(0, "Last Revising Date must be at least 0").optional(),
});