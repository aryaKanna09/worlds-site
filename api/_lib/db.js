import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../../drizzle/schema.js";

let cached = null;

export { schema };

export function getDb() {
  if (!process.env.DATABASE_URL) {
    const err = new Error("database not configured");
    err.status = 503;
    throw err;
  }
  if (!cached) cached = drizzle(neon(process.env.DATABASE_URL), { schema });
  return cached;
}

// Standard handler wrapper: JSON errors, no stack traces to the client.
export function withErrors(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({ error: status === 500 ? "internal error" : err.message });
      if (status === 500) console.error(err);
    }
  };
}
