import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import {relations} from "drizzle-orm"


export const files = pgTable("files", {
    // basic file/folder information
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    path: text("path").notNull(),
    size: text("size").notNull(),
    type: integer("type").notNull(),

    // storage information
    fileUrl: text("file_url"),
    thumbnailUrl: text("thumbnail_url"),

    // Ownership
    userId: text("user_id").notNull(),
    parentId: uuid("parent_id"),

    // file/folder flags
    isFolder: boolean("is_folder").notNull().default(false),
    isStarred: boolean("is_starred").notNull().default(false),
    isTrash: boolean("is_trash").notNull().default(false),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const filesRelations = relations(files, ({one, many}) => ({
    parent: one(files, {
        fields: [files.parentId],
        references: [files.id],
    }),

    // relationship to child file/folder
    children: many(files),
})) 


// Type definitions
export const File = typeof files.$inferSelect
export const NewFile = typeof files.$inferInsert