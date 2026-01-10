import { z } from "zod";

export const createCardSchema = z.object({
    recto: z.string().min(1, "Recto is required"),
    verso: z.string().min(1, "Verso is required"),
    rectoUrl: z.url("Recto URL must be a valid URL").optional().or(z.literal("")),
    versoUrl: z.url("Verso URL must be a valid URL").optional().or(z.literal("")),
    collectionId: z.uuid("Invalid Collection ID"),
});

export const patchCardSchema = z.object({
    id: z.uuid("Invalid Card ID"),
    recto: z.string().min(1, "Recto is required").optional(),
    verso: z.string().min(1, "Verso is required").optional(),
    rectoUrl: z.url("Recto URL must be a valid URL").optional().or(z.literal("")),
    versoUrl: z.url("Verso URL must be a valid URL").optional().or(z.literal("")),
});

export const cardIdParamSchema = z.object({
    id: z.uuid("Invalid Card ID"),
});