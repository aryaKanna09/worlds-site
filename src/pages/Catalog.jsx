import { useEffect, useMemo, useRef, useState } from "react";
import { worlds, WORLD_COUNT, CATEGORIES } from "../data/worlds.js";
import WorldCard from "../components/WorldCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { Micro } from "../components/ui.jsx";

// Stripe always first, then alphabetical.
const SORTED = [...worlds].sort(
  (a, b) => (b.free ? 1 : 0) - (a.free ? 1 : 0) || a.name.localeCompare(b.name)
);

const CHIPS = ["ALL", ...CATEGORIES];

export default function Catalog({ onInstall }) {
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

  useEffect(() => {
    const onKeyDown = (e) => {
      const modalUp = !!document.querySelector('[role="dialog"]');
      if (e.key === "/" && !modalUp) {
        const el = document.activeElement;
        const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
        if (!typing) {
          e.preventDefault();
          searchRef.current?.focus();
        }
      } else if (e.key === "Escape" && !modalUp && query) {
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [query]);

  const pickCategory = (chip) => {
    setCategory(chip);
    setFiltersOpen(false);
  };

  const filterList = (
    <ul className="space-y-1">
      {CHIPS.map((chip) => {
        const active = category === chip;
        return (
          <li key={chip}>
            <button
              type="button"
              onClick={() => pickCategory(chip)}
              aria-pressed={active}
              className={`label-mono w-full rounded-[2px] px-2 py-1.5 text-left text-[11px] transition-colors duration-150 ${
                active ? "text-accent" : "text-gray-mid hover:text-fg"
              }`}
            >
              {chip}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <main>
      <div className="mx-auto max-w-[1120px] px-4 pt-16 pb-10 sm:px-6 md:pt-24">
        <Micro>WORLD CATALOG</Micro>
        <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
          Every system your agent touches.
        </h1>
        <p className="label-mono mt-5 text-xs text-gray-mid">
          {WORLD_COUNT} WORLDS · ALL INSTALLABLE · UPDATED DAILY
        </p>
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
              <div className="max-h-[70vh] overflow-y-auto rounded-[2px] border border-hairline p-2 lg:sticky lg:top-20 lg:border-0 lg:p-0">
                {filterList}
              </div>
            </div>
          </aside>

          <div>
            <div className="flex items-center gap-4">
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH WORLDS…"
                aria-label="Search worlds by name or category"
                className="w-full flex-1 rounded-[2px] border border-hairline bg-bg px-3 py-2 font-mono text-sm tracking-[0.08em] placeholder:text-gray-mid"
              />
              <span className="label-mono shrink-0 text-xs text-gray-mid" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? "WORLD" : "WORLDS"}
              </span>
            </div>

            <div className="mt-6">
              {filtered.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((world, i) => (
                    <WorldCard
                      key={world.id}
                      world={world}
                      index={String(i + 1).padStart(2, "0")}
                      onInstall={onInstall}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
