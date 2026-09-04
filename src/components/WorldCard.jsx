import { Link } from "react-router-dom";
import Ticks from "./Ticks.jsx";
import WorldLogo from "./WorldLogo.jsx";
import { ctaGhost } from "./ui.jsx";

// Uniform card with one configurable action: {label, to} renders a link,
// {label, onClick} a button. One card serves the teaser and every catalog state.
export default function WorldCard({ world, index, action }) {
  return (
    <article className="group relative flex h-full flex-col rounded-[2px] border border-hairline p-4 opacity-[0.92] transition-[border-color,opacity] duration-150 hover:border-[rgba(212,212,212,0.4)] hover:opacity-100">
      <Ticks className="opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
      <div className="flex items-center gap-3">
        <WorldLogo domain={world.domain} name={world.name} />
        <h3 className="flex-1 truncate font-sans text-base font-medium">{world.name}</h3>
        {index && <span className="font-mono text-xs text-gray-mid">{index}</span>}
      </div>
      <p className="label-mono mt-3 truncate text-[10px] text-gray-mid">{world.category}</p>
      <p className="mt-2 line-clamp-2 min-h-[3.2em] text-base leading-[1.6] text-gray-lt">
        {world.description}
      </p>
      <div className="mt-auto flex justify-end pt-4">
        {action?.to ? (
          <Link to={action.to} className={ctaGhost}>
            {action.label}
          </Link>
        ) : action?.onClick ? (
          <button type="button" onClick={action.onClick} className={ctaGhost}>
            {action.label}
          </button>
        ) : null}
      </div>
    </article>
  );
}
