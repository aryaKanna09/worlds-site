import { desc, eq } from "drizzle-orm";
import { getDb, schema, withErrors } from "../_lib/db.js";
import { requireAuth, getOrCreateAccount } from "../_lib/auth.js";
import { latestKey } from "../_lib/keysvc.js";

export default withErrors(async (req, res) => {
  const session = await requireAuth(req);
  const db = getDb();
  const account = await getOrCreateAccount(db, session.sub);
  const myClaims = await db
    .select()
    .from(schema.claims)
    .where(eq(schema.claims.accountId, account.id))
    .orderBy(desc(schema.claims.createdAt));
  const claim = myClaims[0] || null;
  let world = null;
  if (claim) {
    const rows = await db.select().from(schema.worlds).where(eq(schema.worlds.slug, claim.worldSlug));
    world = rows[0] || null;
  }
  const key = await latestKey(db, account.id);
  res.status(200).json({
    account: {
      id: account.id,
      email: account.email,
      roleAnswer: account.roleAnswer,
      verticalAnswer: account.verticalAnswer,
    },
    claim,
    world,
    key: key
      ? { tokenId: key.tokenId, tier: key.tier, channel: key.channel, issuedAt: key.issuedAt, expiresAt: key.expiresAt }
      : null,
  });
});
