// Build-time guardrails, run after every build.
// 1. The private signing key must never reach the client bundle.
// 2. Banned language must not appear in source or bundle.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const failures = [];

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "node_modules" || name === ".git" || name === ".vercel") continue;
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

// 1. Client bundle must not contain private key material.
try {
  for (const f of walk("dist")) {
    const body = readFileSync(f, "latin1");
    if (body.includes("PRIVATE KEY")) failures.push(`private key material in ${f}`);
  }
} catch {
  failures.push("dist/ missing; run the build first");
}

// 2. Banned words in source and bundle. "certif" and product-noun "twin" are
// banned outright; access language stays honest.
const BANNED = [/certif/i, /waitlist/i, /on request/i, /coming soon/i, /\bbeta\b/i, /hosted worlds/i, /parallel fleets/i];
const DASHES = /[–—]/;
const sources = walk("src").filter((f) => /\.(jsx?|tsx?|json|css)$/.test(f));
const apis = walk("api").filter((f) => /\.(mjs|js|ts)$/.test(f));
for (const f of [...sources, ...apis, "index.html"]) {
  const body = readFileSync(f, "utf8");
  for (const re of BANNED) if (re.test(body)) failures.push(`banned term ${re} in ${f}`);
  if (DASHES.test(body)) failures.push(`em or en dash in ${f}`);
}

if (failures.length) {
  console.error("GUARDRAILS FAILED");
  for (const f of failures) console.error(" - " + f);
  process.exit(1);
}
console.log("guardrails clean");
