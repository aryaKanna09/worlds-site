import { desc, eq } from "drizzle-orm";
import { getDb, schema, withErrors } from "./_lib/db.js";
import { requireAuth, getOrCreateAccount } from "./_lib/auth.js";
import { issueKey } from "./_lib/keysvc.js";
import { sendEmail, FOUNDER_EMAIL } from "./_lib/resend.js";
import { acknowledgeProvisioning, notifyFounderProvisioning } from "./_emails/templates.js";

export default withErrors(async (req, res) => {
  const session = await requireAuth(req);
  const db = getDb();
  const account = await getOrCreateAccount(db, session.sub);

  if (req.method === "GET") {
    const mine = await db
      .select()
      .from(schema.claims)
      .where(eq(schema.claims.accountId, account.id))
      .orderBy(desc(schema.claims.createdAt));
    return res.status(200).json({ claims: mine });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  const { world: slug } = req.body || {};
  if (!slug) return res.status(400).json({ error: "world required" });

  const worldRows = await db.select().from(schema.worlds).where(eq(schema.worlds.slug, slug));
  const world = worldRows[0];
  if (!world) return res.status(404).json({ error: "unknown world" });

  const existing = await db.select().from(schema.claims).where(eq(schema.claims.accountId, account.id));
  if (existing.length) return res.status(409).json({ error: "free tier includes one world claim" });

  if (world.live) {
    const [claim] = await db
      .insert(schema.claims)
      .values({ accountId: account.id, worldSlug: slug, status: "active", activatedAt: new Date() })
      .returning();
    const { token, row } = await issueKey(db, account, {});
    return res.status(200).json({
      status: "active",
      claim,
      key: { token, tokenId: row.tokenId, expiresAt: row.expiresAt, channel: row.channel, tier: row.tier },
    });
  }

  const [claim] = await db
    .insert(schema.claims)
    .values({ accountId: account.id, worldSlug: slug, status: "provisioning" })
    .returning();
  const ack = acknowledgeProvisioning(world.name);
  await sendEmail(db, { kind: "provisioning_ack", to: account.email, subject: ack.subject, text: ack.text });
  const notify = notifyFounderProvisioning(world.name, account.email);
  await sendEmail(db, { kind: "provisioning_notify", to: FOUNDER_EMAIL, subject: notify.subject, text: notify.text });
  res.status(200).json({ status: "provisioning", claim, worldName: world.name });
});
