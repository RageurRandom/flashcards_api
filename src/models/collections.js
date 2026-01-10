import { z } from "zod";

export const createCollectionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    isPublic: z.boolean().optional(),
});

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