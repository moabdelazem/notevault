import { Hono } from "hono";

export const notesRouter = new Hono()
  .get("/", (c) => {
    return c.text("This is Get Request");
  })
  .post("/", (c) => {
    return c.text("This is Post Request");
  })
  .put("/", (c) => {
    return c.text("This is Put Request");
  })
  .delete("/", (c) => {
    return c.text("This is Delete Request");
  });
