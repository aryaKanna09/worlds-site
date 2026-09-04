import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { worlds, CATEGORIES } from "../data/worlds.js";
import WorldLogo from "./WorldLogo.jsx";
import { update, issuePlaceholderKey } from "../lib/mock.js";
import { track } from "../lib/analytics.ts";
import { ctaGhost } from "./ui.jsx";

const SORTED = [...worlds].sort((a, b) => (b.free ? 1 : 0) - (a.free ? 1 : 0) || a.name.localeCompare(b.name));
const CHIPS = ["ALL", ...CATEGORIES];

// The full catalog, claimable inside the dashboard. One free claim per
// account; after that every other card routes to pricing as UNLOCK.
export default function ClaimGrid({ session }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const claimedSlug = session.claim?.world || null;
  const claimUsed = Boolean(session.claim);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SORTED.filter(
      (w) =>
        (category === "ALL" || w.category === category) &&
        (!q || w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q))
    );
  }, [query, category]);

  const claim = (world) => {
    const live = world.id === "stripe";
    track("world_claimed", { world: world.id, live });
    if (live) {
      update({
        claim: { world: world.id, name: world.name, status: "active" },
        key: issuePlaceholderKey(session.key?.channel || "stable"),
        keySeen: false,
      });
      track("key_issued", { tier: "free" });
    } else {
      track("provisioning_shown", { world: world.id });
      update({ claim: { world: world.id, name: world.name, status: "provisioning" } });
    }
    navigate(`/dashboard/worlds/${world.id}`);
  };

  return (
    <div className="lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-10">
      <aside className="mb-6 lg:mb-0">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          className="label-mono w-full rounded-[2px] border border-hairline px-3 py-2 text-left text-[11px] text-gray-lt hover:border-gray-lt lg:hidden"
        >
          FILTERS · {category}
        </button>
        <div className={`mt-3 lg:mt-0 ${filtersOpen ? "block" : "hidden"} lg:block`}>
          <p className="label-mono hidden pb-3 text-[10px] text-gray-mid lg:block">FILTER</p>
          <ul className="max-h-[70vh] space-y-1 overflow-y-auto lg:sticky lg:top-20">
            {CHIPS.map((chip) => (
              <li key={chip}>
                <button
                  type="button"
                  onClick={() => {
                    setCategory(chip);
                    setFiltersOpen(false);
                  }}
                  aria-pressed={category === chip}
                  className={`label-mono w-full rounded-[2px] px-2 py-1.5 text-left text-[11px] ${
                    category === chip ? "text-accent" : "text-gray-mid hover:text-fg"
                  }`}
                >
                  {chip}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH WORLDS…"
          aria-label="Search worlds by name or category"
          className="w-full rounded-[2px] border border-hairline bg-bg px-3 py-2 font-mono text-sm tracking-[0.08em] placeholder:text-gray-mid"
        />
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((world) => {
            const isClaimed = world.id === claimedSlug;
            return (
              <article key={world.id} className="group relative flex h-full flex-col rounded-[2px] border border-hairline p-4">
                <div className="flex items-center gap-3">
                  <WorldLogo domain={world.domain} name={world.name} />
                  <h3 className="flex-1 truncate font-sans text-base font-medium">{world.name}</h3>
                  {isClaimed && <span className="label-mono text-[10px] text-accent">CLAIMED</span>}
                </div>
                <p className="label-mono mt-3 truncate text-[10px] text-gray-mid">{world.category}</p>
                <p className="mt-2 line-clamp-2 min-h-[3.2em] text-base leading-[1.6] text-gray-lt">
                  {world.description}
                </p>
                <div className="mt-auto flex justify-end pt-4">
                  {isClaimed ? (
                    <Link to={`/dashboard/worlds/${world.id}`} className={ctaGhost}>
                      OPEN
                    </Link>
                  ) : claimUsed ? (
                    <Link to="/pricing" className={ctaGhost}>
                      UNLOCK
                    </Link>
                  ) : (
                    <button type="button" onClick={() => claim(world)} className={ctaGhost}>
                      CLAIM
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
