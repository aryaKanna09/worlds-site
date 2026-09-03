import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { worlds, featuredWorldIds, featuredWorlds } from "../data/worlds.js";
import { LOGO_ROTATION, WALL_EXCLUDED_IDS } from "../data/ui.js";
import WorldLogo from "./WorldLogo.jsx";

// Rotation order: the recognizable names first, then the rest of the catalog.
// The pointer walks this list, so every logo appears before any repeats.
// Worlds with black favicons are skipped; they vanish on the black background.
const ROTATION = [...featuredWorlds, ...worlds.filter((w) => !featuredWorldIds.includes(w.id))].filter(
  (w) => !WALL_EXCLUDED_IDS.includes(w.id)
);
const { slots: SLOTS, visibleMs, fadeMs, staggerMs } = LOGO_ROTATION;

// Homepage logo wall: fixed slots cycling through every world, full color.
export default function LogoWall() {
  const [slotWorlds, setSlotWorlds] = useState(() => ROTATION.slice(0, SLOTS));
  const [hidden, setHidden] = useState(() => Array(SLOTS).fill(false));
  const paused = useRef(false);
  const ptr = useRef(SLOTS);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeouts = new Set();
    const later = (fn, ms) => {
      const id = setTimeout(() => {
        timeouts.delete(id);
        fn();
      }, ms);
      timeouts.add(id);
    };

    const interval = setInterval(() => {
      if (paused.current) return;
      for (let i = 0; i < SLOTS; i++) {
        later(() => {
          setHidden((h) => h.map((v, j) => (j === i ? true : v)));
          later(() => {
            const next = ROTATION[ptr.current % ROTATION.length];
            ptr.current += 1;
            setSlotWorlds((w) => w.map((world, j) => (j === i ? next : world)));
            setHidden((h) => h.map((v, j) => (j === i ? false : v)));
          }, fadeMs);
        }, i * staggerMs);
      }
    }, visibleMs);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className="mt-14"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <p className="label-mono text-xs text-gray-mid">WORLDS IN THE CATALOG</p>
      <div className="no-scrollbar mt-5 flex items-start gap-8 overflow-x-auto">
        {slotWorlds.map((world, i) => (
          <Link
            key={`slot-${i}`}
            to="/catalog"
            className="group flex w-16 shrink-0 flex-col items-center gap-2"
            aria-label={`${world.name} world in the catalog`}
          >
            <span
              className="transition-opacity"
              style={{ transitionDuration: `${fadeMs}ms`, opacity: hidden[i] ? 0 : 1 }}
            >
              <WorldLogo domain={world.domain} name={world.name} />
            </span>
            <span className="max-w-full truncate font-mono text-[10px] tracking-[0.08em] text-gray-mid opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              {world.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
