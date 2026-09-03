import { asc, eq } from "drizzle-orm";
import { getDb, schema, withErrors } from "../_lib/db.js";
import { requireAuth, getOrCreateAccount, requireAdmin } from "../_lib/auth.js";

export default withErrors(async (req, res) => {
  const session = await requireAuth(req);
  const db = getDb();
  const account = await getOrCreateAccount(db, session.sub);
  requireAdmin(account);
  const rows = await db
    .select({
      id: schema.claims.id,
      worldSlug: schema.claims.worldSlug,
      createdAt: schema.claims.createdAt,
      email: schema.accounts.email,
    })
    .from(schema.claims)
    .innerJoin(schema.accounts, eq(schema.claims.accountId, schema.accounts.id))
    .where(eq(schema.claims.status, "provisioning"))
    .orderBy(asc(schema.claims.createdAt));
  const byWorld = {};
  for (const r of rows) {
    byWorld[r.worldSlug] = byWorld[r.worldSlug] || { world: r.worldSlug, count: 0, oldest: r.createdAt, emails: [] };
    byWorld[r.worldSlug].count += 1;
    byWorld[r.worldSlug].emails.push(r.email);
  }
  const queue = Object.values(byWorld).sort((a, b) => b.count - a.count);
  res.status(200).json({ queue, total: rows.length });
});
