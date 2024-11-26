import { pgTable, unique, integer, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

// Define the schema for the notes table
export const notes = pgTable("notes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({
    name: "notes_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content").notNull(),
});

// Define the schema for the tags table
export const tags = pgTable("tags", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({
    name: "tags_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 2,
  }),
  name: varchar("name", { length: 255 }).notNull(),
});

// Define the schema for the note_tags table
// This table is used to store the many-to-many relationship between notes and tags
export const noteTags = pgTable("note_tags", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({
    name: "note_tags_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 2,
  }),
  noteId: integer("note_id")
    .notNull()
    .references(() => notes.id),
  tagId: integer("tag_id")
    .notNull()
    .references(() => tags.id),
});
