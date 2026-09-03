import { createClerkClient, verifyToken } from "@clerk/backend";
import { eq } from "drizzle-orm";
import { schema } from "./db.js";

const clerk = () => createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function requireAuth(req) {
  if (!process.env.CLERK_SECRET_KEY) {
    const err = new Error("auth not configured");
    err.status = 503;
    throw err;
  }
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    const err = new Error("unauthorized");
    err.status = 401;
    throw err;
  }
  try {
    return await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
  } catch {
    const err = new Error("unauthorized");
    err.status = 401;
    throw err;
  }
}

export async function getOrCreateAccount(db, clerkUserId) {
  const existing = await db.select().from(schema.accounts).where(eq(schema.accounts.clerkUserId, clerkUserId));
  if (existing.length) return existing[0];
  const user = await clerk().users.getUser(clerkUserId);
  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "";
  const inserted = await db
    .insert(schema.accounts)
    .values({ clerkUserId, email })
    .onConflictDoNothing({ target: schema.accounts.clerkUserId })
    .returning();
  if (inserted.length) return inserted[0];
  const again = await db.select().from(schema.accounts).where(eq(schema.accounts.clerkUserId, clerkUserId));
  return again[0];
}

export async function setClerkMetadata(clerkUserId, metadata) {
  try {
    await clerk().users.updateUserMetadata(clerkUserId, { publicMetadata: metadata });
  } catch (err) {
    console.error("clerk metadata update failed", err);
  }
}

export function requireAdmin(account) {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!admins.includes((account.email || "").toLowerCase())) {
    const err = new Error("forbidden");
    err.status = 403;
    throw err;
  }
}
