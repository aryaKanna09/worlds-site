import { useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { worlds, CATEGORIES } from "../data/worlds.js";
import WorldLogo from "../components/WorldLogo.jsx";
import { update, useMockSession, issuePlaceholderKey } from "../lib/mock.js";
import { track } from "../lib/analytics.ts";
import { Micro, ctaGhost, ctaPrimary } from "../components/ui.jsx";

const SORTED = [...worlds].sort((a, b) => (b.free ? 1 : 0) - (a.free ? 1 : 0) || a.name.localeCompare(b.name));
const CHIPS = ["ALL", ...CATEGORIES];

export default function Claim() {
  const navigate = useNavigate();
  const session = useMockSession();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SORTED.filter(
      (w) =>
        (category === "ALL" || w.category === category) &&
        (!q || w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q))
    );
  }, [query, category]);

  if (!session?.signedIn) return <Navigate to="/sign-in" replace />;

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
      navigate("/start");
    } else {
      track("provisioning_shown", { world: world.id });
      update({ claim: { world: world.id, name: world.name, status: "provisioning" } });
    }
  };

  if (session.claim?.status === "provisioning") {
    return (
      <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
        <Micro>YOUR WORLD</Micro>
        <h1 className="mt-3 max-w-[720px] font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
          Your {session.claim.name} world is being prepared. You'll have it shortly.
        </h1>
        <p className="mt-4 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
          Meanwhile, the demo and walkthrough work right now.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/start" className={ctaPrimary}>
            OPEN THE DEMO
          </Link>
          <Link to="/#run=refund:rate-limits" className={ctaGhost}>
            WATCH THE WALKTHROUGH
          </Link>
        </div>
      </main>
    );
  }

  if (session.claim?.status === "active") {
    return (
      <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
        <Micro>YOUR WORLD</Micro>
        <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
          You have the {session.claim.name} world.
        </h1>
        <p className="mt-4 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
          The free tier includes one world. Unlock more from the pricing page.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/start" className={ctaPrimary}>
            GO TO START
          </Link>
          <Link to="/pricing" className={ctaGhost}>
            UNLOCK ANOTHER WORLD
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="mx-auto max-w-[1120px] px-4 pt-16 pb-10 sm:px-6 md:pt-24">
        <Micro>CLAIM A WORLD</Micro>
        <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
          Pick the system your agent touches.
        </h1>
        <p className="label-mono mt-5 text-xs text-gray-mid">ONE FREE CLAIM PER ACCOUNT</p>
      </div>

      <div className="mx-auto max-w-[1120px] px-4 pb-16 sm:px-6 md:pb-24">
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
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH WORLDS…"
              aria-label="Search worlds by name or category"
              className="w-full rounded-[2px] border border-hairline bg-bg px-3 py-2 font-mono text-sm tracking-[0.08em] placeholder:text-gray-mid"
            />
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((world) => (
                <article key={world.id} className="group relative flex h-full flex-col rounded-[2px] border border-hairline p-4">
                  <div className="flex items-center gap-3">
                    <WorldLogo domain={world.domain} name={world.name} />
                    <h3 className="flex-1 truncate font-sans text-base font-medium">{world.name}</h3>
                  </div>
                  <p className="label-mono mt-3 truncate text-[10px] text-gray-mid">{world.category}</p>
                  <p className="mt-2 line-clamp-2 min-h-[3.2em] text-base leading-[1.6] text-gray-lt">
                    {world.description}
                  </p>
                  <div className="mt-auto flex justify-end pt-4">
                    <button type="button" onClick={() => claim(world)} className={ctaGhost}>
                      CLAIM
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
