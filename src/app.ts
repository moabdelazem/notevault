import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";

// Create a new Hono instance
export const app = new Hono();

// Use some hono middleware
app.use(logger());
app.use(prettyJSON());
app.use("*", requestId());
app.use(csrf());

// Setup CORS for all routes
// ? When the app is deployed, you should set the origin to the domain of our frontend
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Setup the API routes
const apiRouter = new Hono();
app.route("/api", apiRouter);
