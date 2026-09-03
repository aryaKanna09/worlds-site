import { getDb, withErrors } from "../_lib/db.js";
import { requireAuth, getOrCreateAccount } from "../_lib/auth.js";
import { latestKey } from "../_lib/keysvc.js";
import { reconstructToken } from "../_lib/sign.js";

export default withErrors(async (req, res) => {
  const session = await requireAuth(req);
  const db = getDb();
  const account = await getOrCreateAccount(db, session.sub);
  const row = await latestKey(db, account.id);
  if (!row) return res.status(404).json({ error: "no key issued" });
  res.status(200).json({
    key: {
      token: reconstructToken(row),
      tokenId: row.tokenId,
      expiresAt: row.expiresAt,
      channel: row.channel,
      tier: row.tier,
    },
  });
});
