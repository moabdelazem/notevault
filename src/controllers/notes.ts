import type { Context } from "hono";
import { db } from "../db/index.js";
import { notes } from "../db/schema.js";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

// Create a new note in the database
export const createNote = async (c: Context) => {
  try {
    // Get The Data from the request
    const { title, content } = await c.req.json();
    // Insert the note into the database
    const newNote = await db
      .insert(notes)
      .values({ title, content })
      .returning();
    return c.json(newNote);
  } catch (error) {
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
};

// Get a single note from the database
export const getNote = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    const note = await db.select().from(notes).where(eq(notes.id, id));
    if (!note) {
      throw new HTTPException(404, { message: "Note not found" });
    }
    return c.json(note);
  } catch (error) {
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
};

// Get all notes from the database
export const listNotes = async (c: Context) => {
  try {
    // Get the notes form the database
    const allNotes = await db.select().from(notes);
    return c.json(allNotes);
  } catch (error) {
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
};

// Update a note in the database
export const updateNote = async (c: Context) => {
  try {
    // Get the note id from the request
    const id = Number(c.req.param("id"));
    // Get the data from the request
    const { title, content } = await c.req.json();
    // Update the note in the database
    const [updatedNote] = await db
      .update(notes)
      .set({ title, content })
      .where(eq(notes.id, id))
      .returning();
    if (!updatedNote) {
      throw new HTTPException(404, { message: "Note not found" });
    }
    return c.json(updatedNote);
  } catch (error) {
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
};

// Delete a note from the database
export const deleteNote = async (c: Context) => {
  try {
    // Get the note id from the request
    const id = Number(c.req.param("id"));
    // Delete the note from the database
    const [deletedNote] = await db
      .delete(notes)
      .where(eq(notes.id, id))
      .returning();

    if (!deletedNote) {
      throw new HTTPException(404, { message: "Note not found" });
    }

    return c.json({ message: "Note Deleted", note: deletedNote });
  } catch (error) {
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
};
