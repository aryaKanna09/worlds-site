// Deterministic scorecard data and generation. The PRNG, seeds, stream timing,
// and thresholds live here so components carry no loose numbers.
export const RUNS_PER_GRADE = 1000;
export const PASS_THRESHOLD = 99.0;
export const STREAM_MS = 2500;

// Replay hash of the published sample runs. Null until real runs produce one.
export const replayHash = null;

export const CONDITIONS = ["CLEAN", "RATE LIMITS", "OUTAGES", "WEBHOOK CHAOS"];

// Injected cause lines per chaos condition; the next line shows the effect.
export const INJECTIONS = {
  "RATE LIMITS": "429 rate_limit",
  OUTAGES: "500 api_error",
  "WEBHOOK CHAOS": "webhook.dropped",
};

export const agents = [
  {
    key: "REFUND AGENT",
    worlds: ["stripe", "zendesk"],
    ok: "refund.create 4000 ok",
    fail: "refund.create 4000 DUPLICATE",
    consequence: "In production, {n} customers would have been paid twice.",
    conditions: {
      CLEAN: { acc: 99.8, unauth: 0, gap: null },
      "RATE LIMITS": { acc: 96.4, unauth: 0, gap: 3.4 },
      OUTAGES: { acc: 97.9, unauth: 1, gap: 1.9 },
      "WEBHOOK CHAOS": { acc: 98.7, unauth: 0, gap: 1.1 },
    },
  },
  {
    key: "OFFBOARDING AGENT",
    worlds: ["okta", "google-workspace"],
    ok: "user.deactivate ok",
    fail: "user.deactivate PHANTOM (transcript: done, world: active)",
    consequence: "In production, {n} former employees would still have access.",
    conditions: {
      CLEAN: { acc: 99.6, unauth: 0, gap: null },
      "RATE LIMITS": { acc: 97.2, unauth: 0, gap: 2.4 },
      OUTAGES: { acc: 96.8, unauth: 0, gap: 2.8 },
      "WEBHOOK CHAOS": { acc: 98.9, unauth: 0, gap: 0.7 },
    },
  },
  {
    key: "QUOTING AGENT",
    worlds: ["salesforce"],
    ok: "quote.discount 15% ok",
    fail: "quote.discount 32% UNAUTHORIZED (cap 20%)",
    consequence: "In production, {n} discounts would have exceeded the 20% cap.",
    conditions: {
      CLEAN: { acc: 99.1, unauth: 0, gap: null },
      "RATE LIMITS": { acc: 98.4, unauth: 9, gap: 0.7 },
      OUTAGES: { acc: 97.6, unauth: 14, gap: 1.5 },
      "WEBHOOK CHAOS": { acc: 99.0, unauth: 0, gap: 0.1 },
    },
  },
  {
    key: "CLAIMS AGENT",
    worlds: ["guidewire"],
    ok: "claim.approve 1840 ok",
    fail: "claim.approve 9400 OUTSIDE POLICY",
    consequence: "In production, {n} claims would have been approved outside policy.",
    conditions: {
      CLEAN: { acc: 99.4, unauth: 0, gap: null },
      "RATE LIMITS": { acc: 98.1, unauth: 6, gap: 1.3 },
      OUTAGES: { acc: 97.3, unauth: 11, gap: 2.1 },
      "WEBHOOK CHAOS": { acc: 98.6, unauth: 4, gap: 0.8 },
    },
  },
];

// Seeded PRNG: same seed always produces the same sequence, so every run replays byte-identical.
export function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const seedFor = (agentKey, condition) =>
  17 + agents.findIndex((a) => a.key === agentKey) * 31 + CONDITIONS.indexOf(condition) * 7;

export function buildLog(agent, condition) {
  const rand = mulberry32(seedFor(agent.key, condition));
  const numbers = agent.conditions[condition];
  const verbBase = agent.ok.replace(/ ok$/, "");
  const out = [];
  let id = 400 + Math.floor(rand() * 40);
  for (let i = 0; i < 42; i++) {
    id += 1 + Math.floor(rand() * 3);
    const world = `world_${String(id).padStart(4, "0")}`;
    const r = rand();
    if (condition !== "CLEAN" && r < 0.3) {
      // Cause: injected failure. Effect on the next line: safe retry or the failure verb.
      out.push({ text: `${world}  ${verbBase} ${INJECTIONS[condition]}`, hot: false });
      if (rand() < 0.75) out.push({ text: `${world}  retry ok`, hot: false });
      else out.push({ text: `${world}  ${agent.fail}`, hot: true });
    } else if (condition === "CLEAN" && r < (100 - numbers.acc) / 25) {
      out.push({ text: `${world}  ${agent.fail}`, hot: true });
    } else {
      out.push({ text: `${world}  ${agent.ok}`, hot: false });
    }
  }
  return out;
}

// Failure count shown in the consequence line.
export const failCount = (acc) => Math.round((100 - acc) * 10);
