import { request, response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from "../db/database.js"
import { users } from "../db/schema.js"
import { eq } from "drizzle-orm"
import { randomUUID } from "crypto"

/**
 * Register a new user
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const registerUser = async (req, res)=>{
    const {mail, name, surname, password} = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const [newUser] = await db.insert(users).values({
            id: randomUUID(),
            mail,
            name,
            surname,
            password: hashedPassword,
        }).returning({
            email: users.mail,
            name: users.name,
            surname: users.surname,
            role: users.role,
        });

        const token = jwt.sign(
            { userId: newUser.id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).send({ 
            message: "User registered successfully",
            user: newUser,
            token 
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send(error);
    }
}


/**
 * Login a user
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export const loginUser = async (req, res)=>{
    const {mail, password} = req.body;

    try {
        const [user] = await db.select().from(users).where(eq(users.mail, mail));

        if (!user) {
            return res.status(401).send({ message: "Invalid email or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).send({
            message: "Login successful",
            user: {
                email: user.mail,
                name: user.name,
                surname: user.surname,
                role: user.role,
            },
            token 
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send(error);
    }
}