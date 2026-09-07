import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tiers, pricingNotes } from "../data/pricing.js";
import { track } from "../lib/analytics.ts";
import { Micro, ctaGhost, ctaPrimary } from "../components/ui.jsx";

export default function PricingPage() {
  const [fallback, setFallback] = useState(null);

  useEffect(() => {
    track("pricing_viewed", {});
  }, []);

  const upgrade = (tier) => {
    track("upgrade_clicked", { tier: tier.key });
    setFallback("https://cal.com/usesparta");
  };

  return (
    <main className="py-16 md:py-24">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <Micro>PRICING</Micro>
        <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
          Start free. Pay for environments, not runs.
        </h1>
        <p className="label-mono mt-4 text-xs text-gray-mid">
          NO METERED RUNS. NO SEAT COUNTS. SIGNING IS FREE ON EVERY TIER.
        </p>
        <p className="mt-3 max-w-[70ch] text-base leading-[1.6] text-gray-lt">
          Free is one world from the whole catalog, your pick, chosen once and fixed to your
          account, so you test against the system you actually run in production from day one. The
          upgrade is not more worlds. It is running worlds together, with State Integrity graded
          across every system in the run.
        </p>
        {fallback && (
          <p className="label-mono mt-4 text-xs text-gray-mid">
            CHECKOUT ISN'T LIVE YET ·{" "}
            <a href={fallback} target="_blank" rel="noreferrer" className="text-gray-lt hover:text-fg">
              TALK TO US
            </a>
          </p>
        )}

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div key={t.key} className="flex flex-col rounded-[2px] border border-hairline p-6">
              <p className="label-mono text-xs text-gray-mid">{t.name}</p>
              <p className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em]">
                {t.price}
                {t.per && <span className="ml-1 font-mono text-xs font-normal text-gray-mid">{t.per}</span>}
              </p>
              <p className="label-mono mt-2 text-[10px] text-gray-mid">UNLIMITED RUNS</p>
              <ul className="mt-5 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="text-sm leading-[1.5] text-gray-lt">
                    {f}
                  </li>
                ))}
              </ul>
              {t.note && (
                <p className="mt-4 font-mono text-xs leading-relaxed tracking-[0.02em] text-gray-mid">
                  {t.note}
                </p>
              )}
              <div className="mt-auto pt-6">
                {t.signIn ? (
                  <Link to="/sign-in" className={`${ctaPrimary} block w-full text-center`}>
                    {t.cta}
                  </Link>
                ) : t.href ? (
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("upgrade_clicked", { tier: t.key })}
                    className={`${ctaGhost} block w-full text-center`}
                  >
                    {t.cta}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => upgrade(t)}
                    className={`${ctaGhost} block w-full text-center`}
                  >
                    {t.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 max-w-[80ch] space-y-2">
          {pricingNotes.map((note) => (
            <p key={note} className="font-mono text-xs leading-relaxed tracking-[0.02em] text-gray-mid">
              {note}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
