import { createPrivateKey, createPublicKey, sign as edSign, randomUUID } from "node:crypto";

const KEY_TTL_DAYS = 30;
const GRACE_DAYS = 7;

function privateKey() {
  const pem = (process.env.TWINLAB_SIGNING_KEY || "").replace(/\\n/g, "\n");
  if (!pem) {
    const err = new Error("signing key not configured");
    err.status = 503;
    throw err;
  }
  return createPrivateKey(pem);
}

export function publicKeyPem() {
  return createPublicKey(privateKey()).export({ type: "spki", format: "pem" }).toString();
}

const b64url = (buf) => Buffer.from(buf).toString("base64url");

export function buildPayload({ accountId, tier, entitlements, channel, issuedAt }) {
  const iat = Math.floor(issuedAt.getTime() / 1000);
  return {
    jti: randomUUID(),
    sub: accountId,
    tier,
    entitlements,
    channel,
    iat,
    exp: iat + KEY_TTL_DAYS * 86400,
    grace: GRACE_DAYS * 86400,
    ver: 1,
  };
}

export function signPayload(payload) {
  const body = Buffer.from(JSON.stringify(payload));
  const sig = edSign(null, body, privateKey());
  return `${b64url(body)}.${b64url(sig)}`;
}

// Ed25519 signatures are deterministic, so a stored key row reconstructs its
// exact token without the token ever being stored.
export function reconstructToken(row) {
  const iat = Math.floor(new Date(row.issuedAt).getTime() / 1000);
  const exp = Math.floor(new Date(row.expiresAt).getTime() / 1000);
  const payload = {
    jti: row.tokenId,
    sub: row.accountId,
    tier: row.tier,
    entitlements: row.entitlements,
    channel: row.channel,
    iat,
    exp,
    grace: GRACE_DAYS * 86400,
    ver: 1,
  };
  return signPayload(payload);
}

export { KEY_TTL_DAYS, GRACE_DAYS };
