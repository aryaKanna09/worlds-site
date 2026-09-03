import Ticks from "../components/Ticks.jsx";
import { tiers } from "../data/pricing.js";
import { Micro, ctaGhost } from "../components/ui.jsx";

export default function PricingPage() {
  return (
    <main className="py-16 md:py-24">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <Micro>PRICING</Micro>
        <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
          One price per company.
        </h1>
        <p className="label-mono mt-4 text-xs text-gray-mid">NO SEATS. NO METERS. FLAT PER COMPANY.</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div key={tier.name} className="group relative flex flex-col rounded-[2px] border border-hairline p-6">
              {tier.ticks && <Ticks className="opacity-0 transition-opacity duration-150 group-hover:opacity-100" />}
              <p className="label-mono text-xs text-gray-mid">{tier.name}</p>
              <p className="mt-4 font-sans text-2xl font-medium tracking-[-0.02em]">
                {tier.price}
                {tier.per && <span className="ml-1 font-mono text-xs font-normal text-gray-mid">{tier.per}</span>}
              </p>
              <p className="label-mono mt-2 text-[11px] text-gray-mid">{tier.sub}</p>
              <ul className="mt-6 space-y-2 text-base leading-[1.6] text-gray-lt">
                {tier.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                {tier.demo ? (
                  <a
                    href="https://cal.com/usesparta"
                    target="_blank"
                    rel="noreferrer"
                    className={`${ctaGhost} block w-full text-center`}
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <a href="#" className={`${ctaGhost} block w-full text-center`}>
                    {tier.cta}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
