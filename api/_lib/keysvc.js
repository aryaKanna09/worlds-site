import { and, desc, eq } from "drizzle-orm";
import { schema } from "./db.js";
import { buildPayload, signPayload } from "./sign.js";

// Issues a signed key for the account's claimed world (stripe by default).
export async function issueKey(db, account, { channel = "stable" } = {}) {
  const myClaims = await db
    .select()
    .from(schema.claims)
    .where(and(eq(schema.claims.accountId, account.id), eq(schema.claims.status, "active")))
    .orderBy(desc(schema.claims.createdAt));
  const worldSlug = myClaims[0]?.worldSlug || "stripe";
  const payload = buildPayload({
    accountId: account.id,
    tier: "free",
    entitlements: [`world:${worldSlug}`],
    channel,
    issuedAt: new Date(),
  });
  const token = signPayload(payload);
  const [row] = await db
    .insert(schema.keys)
    .values({
      accountId: account.id,
      tokenId: payload.jti,
      entitlements: payload.entitlements,
      tier: payload.tier,
      channel,
      issuedAt: new Date(payload.iat * 1000),
      expiresAt: new Date(payload.exp * 1000),
    })
    .returning();
  return { token, row };
}

export async function latestKey(db, accountId) {
  const rows = await db
    .select()
    .from(schema.keys)
    .where(and(eq(schema.keys.accountId, accountId), eq(schema.keys.revoked, false)))
    .orderBy(desc(schema.keys.issuedAt));
  return rows[0] || null;
}
