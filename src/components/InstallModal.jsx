import { useEffect, useRef, useState } from "react";
import Ticks from "./Ticks.jsx";
import { COPY_FLASH_MS } from "../data/ui.js";
import { installSteps } from "../data/install.js";
import { withWorlds } from "./Worlds.jsx";

// One copyable command per install step. Multi line commands (the CI snippet)
// keep their line breaks.
function CommandBlock({ command }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_FLASH_MS);
    });
  };
  return (
    <div className="mt-2 flex items-start justify-between gap-3 rounded-[2px] border border-hairline bg-[#0a0a0a] px-3 py-2.5">
      <pre className="min-w-0 overflow-x-auto font-mono text-xs leading-relaxed text-gray-lt">
        <code>{command}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${command}`}
        className={`label-mono shrink-0 text-[10px] ${copied ? "text-accent" : "text-gray-mid hover:text-fg"}`}
      >
        {copied ? "COPIED" : "COPY"}
      </button>
    </div>
  );
}

// One modal for every world, parameterized by the world it installs.
export default function InstallModal({ world, onClose }) {
  const panelRef = useRef(null);
  const steps = installSteps(world.name);

  useEffect(() => {
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () => panel.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
    focusables()[0]?.focus();

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const items = Array.from(focusables());
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    panel.addEventListener("keydown", onKeyDown);
    return () => {
      panel.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Install ${world.name} world`}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full overflow-y-auto rounded-[2px] border border-hairline bg-bg p-6 sm:max-w-lg sm:p-8"
      >
        <Ticks corners={["tl", "bl"]} />
        <div className="flex items-start justify-between gap-4">
          <p className="label-mono text-xs text-gray-mid">INSTALL: {world.name.toUpperCase()} WORLD</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 font-mono text-lg leading-none text-gray-mid hover:text-fg"
          >
            ×
          </button>
        </div>

        <ol className="mt-6 space-y-5">
          {steps.map(([label, detail, command], i) => (
            <li key={label} className="flex gap-4">
              <span className="label-mono shrink-0 text-xs text-gray-mid">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="label-mono text-xs text-fg">{label}</p>
                <CommandBlock command={command} />
                {detail && (
                  <p className="mt-1.5 text-sm leading-[1.6] text-gray-lt">{withWorlds(detail)}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
