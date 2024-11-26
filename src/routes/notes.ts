import { Hono } from "hono";
import {
  createNote,
  deleteNote,
  getNote,
  listNotes,
  updateNote,
} from "../controllers/notes.js";

export const notesRouter = new Hono()
  .get("/", listNotes)
  .get("/:id", getNote)
  .post("/", createNote)
  .put("/:id", updateNote)
  .delete("/:id", deleteNote);
