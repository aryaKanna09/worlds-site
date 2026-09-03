import { getDb, withErrors } from "./_lib/db.js";
import { requireAuth, getOrCreateAccount } from "./_lib/auth.js";
import { sendEmail } from "./_lib/resend.js";
import { inviteEngineer } from "./_emails/templates.js";

export default withErrors(async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  const session = await requireAuth(req);
  const db = getDb();
  const account = await getOrCreateAccount(db, session.sub);
  const { email } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "valid email required" });
  }
  const origin = `https://${req.headers.host}`;
  const link = `${origin}/claim?invited_by=${account.id}`;
  const tpl = inviteEngineer(account.email, link);
  await sendEmail(db, { kind: "engineer_invite", to: email, subject: tpl.subject, text: tpl.text });
  res.status(200).json({ ok: true });
});
