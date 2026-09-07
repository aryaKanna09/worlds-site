import { useState } from "react";
import { Link } from "react-router-dom";
import { worlds, featuredWorlds } from "../data/worlds.js";
import { COPY_FLASH_MS } from "../data/ui.js";
import WorldCard from "./WorldCard.jsx";
import Worlds from "./Worlds.jsx";
import { Section, Micro, H2, ctaGhost } from "./ui.jsx";

const STRIPE = worlds.find((w) => w.id === "stripe");

export default function CatalogTeaser({ onInstall }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText("npx twinlab demo").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FLASH_MS);
    });
  };

  return (
    <Section>
      <Micro>WORLDS</Micro>
      <H2>Grades need ground truth. We build it.</H2>
      <div className="mt-8 max-w-[720px]">
        <p className="text-lg leading-[1.6] text-gray-lt">
          No sandbox to point at, or one that can't be reset, seeded, or broken on purpose?{" "}
          <Worlds /> builds the environment.
        </p>
        <p className="mt-4 text-base leading-[1.6] text-gray-lt">
          It doesn't predict production, it reproduces it: same endpoints, same state, same failure
          modes, repeatable on demand. A record becomes a measurement with a date on it, not a
          promise about the future. Your agent says the task is done. <Worlds /> diffs the
          environment and tells you what really changed.
        </p>
        <p className="mt-3 text-base leading-[1.6] text-gray-lt">
          Every world updates daily against the live service, patch notes, API changes, and
          internal updates land the same day, so your agent is graded on today's rules, not last
          quarter's.
        </p>
        <p className="mt-3 text-base leading-[1.6] text-gray-lt">
          It runs alongside your agent as a sidecar, never inside it. Your agent's code and
          imports stay exactly as they are.
        </p>
      </div>
      <p className="label-mono mt-4 text-xs text-gray-mid">
        <span className="text-accent">●</span> EVERY WORLD SYNCED DAILY
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {featuredWorlds.slice(0, 4).map((world, i) => (
          <WorldCard
            key={world.id}
            world={world}
            index={String(i + 1).padStart(2, "0")}
            action={{ label: "INSTALL", onClick: () => onInstall(world) }}
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
          <code className="text-gray-lt">npx twinlab demo</code>
          <button
            type="button"
            onClick={copy}
            className={`label-mono text-xs ${copied ? "text-accent" : "text-gray-mid hover:text-fg"}`}
          >
            {copied ? "COPIED" : "COPY"}
          </button>
          <span aria-hidden="true">·</span>
          <span className="tracking-[0.08em]">PICK ANY WORLD, RUNS ON YOUR MACHINE, NOTHING PHONES HOME</span>
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
