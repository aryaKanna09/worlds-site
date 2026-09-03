import { desc, eq, inArray } from "drizzle-orm";
import { getDb, schema, withErrors } from "./_lib/db.js";
import { requireAuth, getOrCreateAccount } from "./_lib/auth.js";

export default withErrors(async (req, res) => {
  const session = await requireAuth(req);
  const db = getDb();
  const account = await getOrCreateAccount(db, session.sub);
  const myKeys = await db.select().from(schema.keys).where(eq(schema.keys.accountId, account.id));
  const ids = myKeys.map((k) => k.tokenId);
  if (!ids.length) return res.status(200).json({ verifications: [] });
  const rows = await db
    .select()
    .from(schema.verifyLog)
    .where(inArray(schema.verifyLog.tokenId, ids))
    .orderBy(desc(schema.verifyLog.createdAt));
  res.status(200).json({
    verifications: rows.map((r) => ({ tokenId: r.tokenId, at: r.createdAt })),
  });
});
