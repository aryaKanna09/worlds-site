import { useState } from "react";
import { FAVICON_SIZE } from "../data/ui.js";

// Favicon with monogram fallback, always in full brand color. A null domain
// renders the monogram directly. `sizeClass` sets the square dimensions.
export default function WorldLogo({ domain, name, sizeClass = "h-8 w-8" }) {
  const [failed, setFailed] = useState(false);

  if (!domain || failed) {
    return (
      <div
        aria-hidden="true"
        className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-[2px] border border-hairline bg-[#111111] font-mono text-sm text-fg`}
      >
        {name[0].toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${FAVICON_SIZE}`}
      alt={`${name} logo`}
      width={32}
      height={32}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${sizeClass} shrink-0 rounded-[2px] object-contain`}
    />
  );
}
