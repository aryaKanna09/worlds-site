import { useEffect } from "react";
import { track } from "../lib/analytics.ts";

const modules = import.meta.glob("../data/patchnotes/*.json", { eager: true });
const feeds = {};
for (const [path, mod] of Object.entries(modules)) {
  feeds[path.split("/").pop().replace(".json", "")] = mod.default;
}

const P = () => <span className="text-gray-mid">PENDING</span>;

// The daily updates feed for a world. Real drift run history when provided;
// a single PENDING entry otherwise.
export default function PatchNotes({ world, surface }) {
  const entries = feeds[world] || [];

  useEffect(() => {
    track("patchnotes_viewed", { world, surface });
  }, [world, surface]);

  if (!entries.length) {
    return <p className="label-mono text-xs text-gray-mid">NO FEED YET · PENDING</p>;
  }

  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {entries.map((e, i) => (
        <div key={i} className="py-4 font-mono text-xs leading-relaxed tracking-[0.02em]">
          <p className="text-gray-mid">
            {e.date ?? <P />} · WORLD {e.worldVersion ?? <P />} · FIDELITY {e.fidelity ?? <P />}
          </p>
          <p className="mt-2 text-gray-lt">API: {e.apiChange ?? <P />}</p>
          <p className="mt-1 text-gray-lt">WORLD: {e.worldChange ?? <P />}</p>
        </div>
      ))}
    </div>
  );
}
