import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from 'crypto'

export const users = sqliteTable("users", {
    id: text().primaryKey().default(() => randomUUID()),
    mail: text().notNull(),
    name: text().notNull(),
    surname: text().notNull(),
    password: text().notNull(),
    role: text({enum: ['admin', 'user']}).notNull().default('user'),
    
    createdAt: integer('created_at', { mode: 'timestamp'}).$defaultFn(
        () => new Date()
    ),
});

export const collections = sqliteTable("collections", {
    id: text().primaryKey().default(() => randomUUID()),
    title: text().notNull(),
    description: text().notNull(),
    isPublic: integer('is_public').notNull().default(0),
    creatorId: text('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

    createdAt: integer('created_at', { mode: 'timestamp'}).$defaultFn(
        () => new Date()
    ),
});

export const cards = sqliteTable("cards", {
    id: text().primaryKey().default(() => randomUUID()),
    recto: text().notNull(),
    verso: text().notNull(),
    rectoUrl: text('recto_url').notNull(),
    versoUrl: text('verso_url').notNull(),
    collectionId: text('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),

    createdAt: integer('created_at', { mode: 'timestamp'}).$defaultFn(
        () => new Date()
    ),
});

export const revisings = sqliteTable("revising", {
    cardId: text('card_id').notNull().references(() => cards.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    level : integer().notNull().default(0),
    lastRevisingDate: integer('last_revising_date').notNull().default(0),

    createdAt: integer('created_at', { mode: 'timestamp'}).$defaultFn(
        () => new Date()
    ),
    
}, (table) => ({
    primaryKey: ({name: "pk_revising", columns: [table.cardId, table.userId]})
}));

