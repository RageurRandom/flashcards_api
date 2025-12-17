import { randomUUID } from "crypto";
import { db } from "./database.js";
import { users, collections, cards, revisings } from "./schema.js";
import bcrypt from "bcrypt";

const seed = async ()=>{
    console.log('Starting database seeding...');

    try {
        // Clear existing data
        await db.delete(revisings).execute();
        await db.delete(cards).execute();
        await db.delete(collections).execute();
        await db.delete(users).execute();

        // Seed users
        const passwordHash = await bcrypt.hash("password123", 10);
        const user1 = {
            id: randomUUID(),
            mail: "alice@example.com",
            name: "Alice",
            surname: "Smith",
            password: passwordHash,
            role: "user"
        };
        const user2 = {
            id: randomUUID(),
            mail: "bob@example.com",
            name: "Bob",
            surname: "Brown",
            password: passwordHash,
            role: "admin"
        };
        await db.insert(users).values([user1, user2]);

        // Seed collections
        const collection1 = {
            id: "col-1",
            title: "Math",
            description: "Basic math flashcards",
            isPublic: 1,
            creatorId: user1.id
        };
        const collection2 = {
            id: "col-2",
            title: "History",
            description: "World history flashcards",
            isPublic: 0,
            creatorId: user2.id
        };
        await db.insert(collections).values([collection1, collection2]);

        // Seed cards
        const card1 = {
            id: "card-1",
            recto: "2+2",
            verso: "4",
            rectoUrl: "",
            versoUrl: "",
            collectionId: collection1.id
        };
        const card2 = {
            id: "card-2",
            recto: "Who discovered America?",
            verso: "Christopher Columbus",
            rectoUrl: "",
            versoUrl: "",
            collectionId: collection2.id
        };
        await db.insert(cards).values([card1, card2]);

        // Seed revisings
        const revising1 = {
            cardId: card1.id,
            userId: user1.id,
            level: 1,
            lastRevisingDate: Date.now()
        };
        const revising2 = {
            cardId: card2.id,
            userId: user2.id,
            level: 2,
            lastRevisingDate: Date.now()
        };
        await db.insert(revisings).values([revising1, revising2]);

        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Error during seeding:', error);
        return;
    }
}

seed();