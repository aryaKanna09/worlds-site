import { eq } from "drizzle-orm";
import { getDb, schema, withErrors } from "../_lib/db.js";
import { requireAuth, getOrCreateAccount, setClerkMetadata } from "../_lib/auth.js";

export default withErrors(async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  const session = await requireAuth(req);
  const db = getDb();
  const account = await getOrCreateAccount(db, session.sub);
  const { role = null, vertical = null } = req.body || {};
  await db
    .update(schema.accounts)
    .set({ roleAnswer: role, verticalAnswer: vertical })
    .where(eq(schema.accounts.id, account.id));
  await setClerkMetadata(session.sub, { role_answer: role, vertical_answer: vertical });
  res.status(200).json({ id: account.id });
});
