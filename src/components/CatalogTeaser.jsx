import { useState } from "react";
import { Link } from "react-router-dom";
import { worlds, featuredWorlds } from "../data/worlds.js";
import { COPY_FLASH_MS } from "../data/ui.js";
import WorldCard from "./WorldCard.jsx";
import { Section, Micro, H2, ctaGhost } from "./ui.jsx";

const STRIPE = worlds.find((w) => w.id === "stripe");

export default function CatalogTeaser({ onInstall }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText("pip install worlds").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FLASH_MS);
    });
  };

  return (
    <Section>
      <Micro>WORLDS</Micro>
      <H2>Environments we build ourselves.</H2>
      <p className="mt-8 max-w-[720px] text-lg leading-[1.6] text-gray-lt">
        When there's no sandbox to point at, or the sandbox can't be reset, seeded, or broken on purpose,
        worlds builds the environment.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {featuredWorlds.slice(0, 4).map((world, i) => (
          <WorldCard
            key={world.id}
            world={world}
            index={String(i + 1).padStart(2, "0")}
            onInstall={onInstall}
          />
        ))}
      </div>

      <div className="mt-10">
        <Link to="/catalog" className={`${ctaGhost} group inline-flex items-center gap-2`}>
          SEE MORE
          <span aria-hidden="true" className="transition-colors duration-150 group-hover:text-accent">
            →
          </span>
        </Link>
      </div>

      <div className="mt-8 border-t border-hairline pt-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 font-mono text-xs text-gray-mid">
          <span className="tracking-[0.08em]">FREE FOR DEVELOPERS</span>
          <span aria-hidden="true">·</span>
          <code className="text-gray-lt">pip install worlds</code>
          <button
            type="button"
            onClick={copy}
            className={`label-mono text-xs ${copied ? "text-accent" : "text-gray-mid hover:text-fg"}`}
          >
            {copied ? "COPIED" : "COPY"}
          </button>
          <span aria-hidden="true">·</span>
          <span className="tracking-[0.08em]">STRIPE WORLD, LOCAL, DETERMINISTIC</span>
          <button
            type="button"
            onClick={() => onInstall(STRIPE)}
            className={`${ctaGhost} px-3 py-1.5 text-[11px]`}
          >
            QUICKSTART
          </button>
        </div>
      </div>
    </Section>
  );
}
