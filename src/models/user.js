import e from "express";
import{ email, z } from "zod";

export const createUserSchema = z.object({
    mail: email("Invalid email address"),
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(['admin', 'user']).optional(),
});

export const loginUserSchema = z.object({
    mail: email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});