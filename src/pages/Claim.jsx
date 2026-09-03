import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { worlds, CATEGORIES } from "../data/worlds.js";
import WorldLogo from "../components/WorldLogo.jsx";
import { apiFetch } from "../lib/api.js";
import { track } from "../lib/analytics.ts";
import { hasClerk, AuthPending } from "../lib/clerk.jsx";
import { Micro, ctaGhost, ctaPrimary } from "../components/ui.jsx";

const SORTED = [...worlds].sort((a, b) => (b.free ? 1 : 0) - (a.free ? 1 : 0) || a.name.localeCompare(b.name));
const CHIPS = ["ALL", ...CATEGORIES];

function ClaimInner() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [existing, setExisting] = useState(null);
  const [claiming, setClaiming] = useState(null);
  const [provisioned, setProvisioned] = useState(null);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    apiFetch("/api/claims", { getToken })
      .then((d) => setExisting(d.claims?.[0] || null))
      .catch(() => setExisting(null));
  }, [getToken]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SORTED.filter(
      (w) =>
        (category === "ALL" || w.category === category) &&
        (!q || w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q))
    );
  }, [query, category]);

  const claim = async (world) => {
    setClaiming(world.id);
    setError(null);
    try {
      const body = { world: world.id };
      const invitedBy = params.get("invited_by");
      if (invitedBy) body.invited_by = invitedBy;
      const result = await apiFetch("/api/claims", { getToken, method: "POST", body });
      track("world_claimed", { world: world.id, live: result.status === "active" });
      if (result.status === "active") {
        track("key_issued", { tier: result.key?.tier || "free" });
        navigate("/start");
      } else {
        track("provisioning_shown", { world: world.id });
        setProvisioned(result.worldName || world.name);
        setExisting(result.claim);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setClaiming(null);
    }
  };

  if (provisioned || (existing && existing.status === "provisioning")) {
    const name = provisioned || existing.worldSlug;
    return (
      <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
        <Micro>YOUR WORLD</Micro>
        <h1 className="mt-3 max-w-[720px] font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
          Your {name} world is being prepared. You'll have it shortly.
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

  if (existing && existing.status === "active") {
    return (
      <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
        <Micro>YOUR WORLD</Micro>
        <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
          You have the {existing.worldSlug} world.
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
        {error && <p className="label-mono mt-3 text-xs text-accent">{error.toUpperCase()}</p>}
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
                    <button
                      type="button"
                      disabled={claiming !== null}
                      onClick={() => claim(world)}
                      className={ctaGhost}
                    >
                      {claiming === world.id ? "CLAIMING" : "CLAIM"}
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

export default function Claim() {
  if (!hasClerk) return <AuthPending />;
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <ClaimInner />
      </SignedIn>
    </>
  );
}
