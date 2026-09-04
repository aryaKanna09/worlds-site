import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tiers, reportsNote } from "../data/pricing.js";
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
          One price per company.
        </h1>
        <p className="label-mono mt-4 text-xs text-gray-mid">
          FLAT PER COMPANY. NO USAGE BILLED.
        </p>
        <p className="mt-3 max-w-[60ch] text-base leading-[1.6] text-gray-lt">{reportsNote}</p>
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
              <ul className="mt-5 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="text-sm leading-[1.5] text-gray-lt">
                    {f}
                  </li>
                ))}
              </ul>
              {t.note && (
                <p className="label-mono mt-4 text-[10px] leading-[1.6] text-gray-mid">{t.note}</p>
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
      </div>
    </main>
  );
}
