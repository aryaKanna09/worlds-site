import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tiers, featureRows, reportsNote } from "../data/pricing.js";
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
          FLAT PER COMPANY. NO SEATS BILLED. NO USAGE BILLED.
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

        <div className="mt-10 hidden lg:block">
          <div className="grid grid-cols-5 border-y border-hairline">
            <div className="p-4" />
            {tiers.map((t) => (
              <div key={t.key} className="border-l border-hairline p-4">
                <p className="label-mono text-xs text-gray-mid">{t.name}</p>
                <p className="mt-2 font-sans text-2xl font-medium tracking-[-0.02em]">
                  {t.price}
                  {t.per && <span className="ml-1 font-mono text-xs font-normal text-gray-mid">{t.per}</span>}
                </p>
              </div>
            ))}
            {featureRows.map(([label, ...cells]) => (
              <div key={label} className="col-span-5 grid grid-cols-subgrid border-t border-hairline">
                <p className="label-mono p-4 text-[10px] text-gray-mid">{label}</p>
                {cells.map((c, i) => (
                  <p key={i} className="border-l border-hairline p-4 text-sm leading-[1.5] text-gray-lt">
                    {c}
                  </p>
                ))}
              </div>
            ))}
            <div className="col-span-5 grid grid-cols-subgrid border-t border-hairline">
              <div className="p-4" />
              {tiers.map((t) => (
                <div key={t.key} className="border-l border-hairline p-4">
                  {t.signIn ? (
                    <Link to="/sign-in" className={ctaPrimary}>
                      {t.cta}
                    </Link>
                  ) : (
                    <button type="button" onClick={() => upgrade(t)} className={ctaGhost}>
                      {t.cta}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:hidden">
          {tiers.map((t, ti) => (
            <div key={t.key} className="flex flex-col rounded-[2px] border border-hairline p-6">
              <p className="label-mono text-xs text-gray-mid">{t.name}</p>
              <p className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em]">
                {t.price}
                {t.per && <span className="ml-1 font-mono text-xs font-normal text-gray-mid">{t.per}</span>}
              </p>
              <ul className="mt-5 space-y-2">
                {featureRows.map(([label, ...cells]) => (
                  <li key={label} className="text-sm leading-[1.5] text-gray-lt">
                    <span className="label-mono block text-[10px] text-gray-mid">{label}</span>
                    {cells[ti]}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                {t.signIn ? (
                  <Link to="/sign-in" className={`${ctaPrimary} block w-full text-center`}>
                    {t.cta}
                  </Link>
                ) : (
                  <button type="button" onClick={() => upgrade(t)} className={`${ctaGhost} block w-full text-center`}>
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
