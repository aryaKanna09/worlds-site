// In-memory token bucket per IP. Good enough per warm serverless instance;
// the upgrade path is a shared store (Upstash or Vercel KV) keyed the same way.
const buckets = new Map();
const CAPACITY = 20;
const REFILL_PER_SEC = 0.5;

export function rateLimit(req) {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "local";
  const now = Date.now() / 1000;
  const b = buckets.get(ip) || { tokens: CAPACITY, at: now };
  b.tokens = Math.min(CAPACITY, b.tokens + (now - b.at) * REFILL_PER_SEC);
  b.at = now;
  if (b.tokens < 1) {
    buckets.set(ip, b);
    const err = new Error("rate limited");
    err.status = 429;
    throw err;
  }
  b.tokens -= 1;
  buckets.set(ip, b);
}
