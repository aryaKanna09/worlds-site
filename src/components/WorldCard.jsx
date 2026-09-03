import Ticks from "./Ticks.jsx";
import WorldLogo from "./WorldLogo.jsx";
import { ctaGhost } from "./ui.jsx";

// Every world is built and installable: INSTALL opens the setup modal.
export default function WorldCard({ world, index, onInstall }) {
  return (
    <article className="group relative rounded-[2px] border border-hairline p-4 opacity-[0.92] transition-[border-color,opacity] duration-150 hover:border-[rgba(212,212,212,0.4)] hover:opacity-100">
      <Ticks className="opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
      <div className="flex items-center gap-3">
        <WorldLogo domain={world.domain} name={world.name} />
        <h3 className="flex-1 truncate font-sans text-base font-medium">{world.name}</h3>
        <span className="font-mono text-xs text-gray-mid">{index}</span>
      </div>
      <p className="label-mono mt-3 text-[10px] text-gray-mid">{world.category}</p>
      <p className="mt-2 min-h-12 text-base leading-[1.6] text-gray-lt">{world.description}</p>
      <div className="mt-4 flex justify-end">
        <button type="button" onClick={() => onInstall(world)} className={ctaGhost}>
          INSTALL
        </button>
      </div>
    </article>
  );
}
