import type { Context } from "hono";
import { db } from "../db/index.js";
import { notes } from "../db/schema.js";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

// Utility function to send JSON error response
const sendError = (c: Context, status: number, message: string) => {
  return c.json({ error: message }, { status });
};

// Create a new note in the database
export const createNote = async (c: Context) => {
  try {
    // Get the data from the request
    const { title, content } = await c.req.json();

    if (!title || !content) {
      return sendError(c, 400, "Title and content are required.");
    }

    // Insert the note into the database
    const newNote = await db
      .insert(notes)
      .values({ title, content })
      .returning();
    return c.json(newNote);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error");
  }
};

// Get a single note from the database
export const getNote = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return sendError(c, 400, "Invalid note ID.");
    }

    const note = await db.select().from(notes).where(eq(notes.id, id));
    if (!note || note.length === 0) {
      return sendError(c, 404, "Note not found.");
    }

    return c.json(note);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error");
  }
};

// Get all notes from the database
export const listNotes = async (c: Context) => {
  try {
    // Get all notes from the database
    const allNotes = await db.select().from(notes);
    return c.json(allNotes);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error");
  }
};

// Update a note in the database
export const updateNote = async (c: Context) => {
  try {
    // Get the note id from the request
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return sendError(c, 400, "Invalid note ID.");
    }

    // Get the data from the request
    const { title, content } = await c.req.json();
    if (!title && !content) {
      return sendError(
        c,
        400,
        "At least one of title or content is required to update."
      );
    }

    // Update the note in the database
    const [updatedNote] = await db
      .update(notes)
      .set({ title, content })
      .where(eq(notes.id, id))
      .returning();

    if (!updatedNote) {
      return sendError(c, 404, "Note not found.");
    }

    return c.json(updatedNote);
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error");
  }
};

// Delete a note from the database
export const deleteNote = async (c: Context) => {
  try {
    // Get the note id from the request
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return sendError(c, 400, "Invalid note ID.");
    }

    // Delete the note from the database
    const [deletedNote] = await db
      .delete(notes)
      .where(eq(notes.id, id))
      .returning();

    if (!deletedNote) {
      return sendError(c, 404, "Note not found.");
    }

    return c.json({ message: "Note Deleted", note: deletedNote });
  } catch (error) {
    console.error(error);
    return sendError(c, 500, "Internal Server Error");
  }
};
