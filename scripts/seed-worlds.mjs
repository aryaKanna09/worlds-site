// Seeds the worlds table from the catalog data. live=true only for stripe.
// Usage: DATABASE_URL=... node scripts/seed-worlds.mjs
import { neon } from "@neondatabase/serverless";
import { worlds } from "../src/data/worlds.js";

if (!process.env.DATABASE_URL) {
  console.error("Set DATABASE_URL first.");
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);

let i = 0;
for (const w of worlds) {
  await sql`
    insert into worlds (slug, name, system_domain, category, live, sort)
    values (${w.id}, ${w.name}, ${w.domain}, ${w.category}, ${w.id === "stripe"}, ${i})
    on conflict (slug) do update set
      name = excluded.name,
      system_domain = excluded.system_domain,
      category = excluded.category,
      live = excluded.live,
      sort = excluded.sort
  `;
  i += 1;
}
console.log(`Seeded ${i} worlds. live=true for stripe only.`);
