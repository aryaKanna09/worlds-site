import { getDb, withErrors } from "../_lib/db.js";
import { requireAuth, getOrCreateAccount } from "../_lib/auth.js";
import { issueKey, latestKey } from "../_lib/keysvc.js";

export default withErrors(async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  const session = await requireAuth(req);
  const db = getDb();
  const account = await getOrCreateAccount(db, session.sub);
  const previous = await latestKey(db, account.id);
  const channel = req.body?.channel || previous?.channel || "stable";
  const { token, row } = await issueKey(db, account, { channel });
  res.status(200).json({
    key: { token, tokenId: row.tokenId, expiresAt: row.expiresAt, channel: row.channel, tier: row.tier },
  });
});
