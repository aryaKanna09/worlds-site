import { eq } from "drizzle-orm";
import { getDb, schema, withErrors } from "../_lib/db.js";
import { rateLimit } from "../_lib/ratelimit.js";

async function captureServerSide(jtiPrefix) {
  const key = process.env.VITE_POSTHOG_KEY;
  const host = process.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";
  if (!key) return;
  try {
    await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event: "report_verified",
        distinct_id: "verify-endpoint",
        properties: { jti_prefix: jtiPrefix },
      }),
    });
  } catch {
    // Analytics must never break verification.
  }
}

export default withErrors(async (req, res) => {
  rateLimit(req);
  const { jti } = req.query;
  const db = getDb();
  const rows = await db.select().from(schema.keys).where(eq(schema.keys.tokenId, jti));
  const key = rows[0];
  if (!key) return res.status(200).json({ valid: false });
  await db.insert(schema.verifyLog).values({ tokenId: jti });
  await captureServerSide(String(jti).slice(0, 8));
  const world = (key.entitlements || []).find((e) => String(e).startsWith("world:")) || null;
  res.status(200).json({
    valid: !key.revoked && new Date(key.expiresAt).getTime() > Date.now(),
    tier: key.tier,
    world: world ? world.slice(6) : null,
    issued: key.issuedAt,
    expires: key.expiresAt,
  });
});
