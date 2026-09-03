import { pgTable, text, boolean, timestamp, uuid, jsonb, integer } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  roleAnswer: text("role_answer"),
  verticalAnswer: text("vertical_answer"),
  invitedBy: text("invited_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const worlds = pgTable("worlds", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  systemDomain: text("system_domain").notNull(),
  category: text("category").notNull(),
  live: boolean("live").default(false).notNull(),
  sort: integer("sort").default(0).notNull(),
});

export const claims = pgTable("claims", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id").notNull(),
  worldSlug: text("world_slug").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  activatedAt: timestamp("activated_at"),
});

export const keys = pgTable("keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id").notNull(),
  tokenId: text("token_id").notNull().unique(),
  entitlements: jsonb("entitlements").notNull(),
  tier: text("tier").notNull(),
  channel: text("channel").notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  revoked: boolean("revoked").default(false).notNull(),
});

export const eventsOutbox = pgTable("events_outbox", {
  id: uuid("id").defaultRandom().primaryKey(),
  kind: text("kind").notNull(),
  toEmail: text("to_email").notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
});

export const verifyLog = pgTable("verify_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  tokenId: text("token_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
