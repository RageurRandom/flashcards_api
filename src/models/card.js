import { z } from "zod";

export const createCardSchema = z.object({
    recto: z.string().min(1, "Recto is required"),
    verso: z.string().min(1, "Verso is required"),
    rectoUrl: z.string().url("Recto URL must be a valid URL").optional().or(z.literal("")),
    versoUrl: z.string().url("Verso URL must be a valid URL").optional().or(z.literal("")),
    collectionId: z.string().min(1, "Collection ID is required"),
});