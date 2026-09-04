// The product name in running copy: capital W in brand orange, rest inherits
// the surrounding color. One text flow, no word break, so screen readers say
// "Worlds" as a single word.
export default function Worlds({ className = "" }) {
  return (
    // prettier-ignore
    <span className={className}><span className="text-accent">W</span>orlds</span>
  );
}

// For copy that lives in data files: splits on the product name and applies
// the treatment without hardcoding markup at every mention.
export function withWorlds(text) {
  const parts = String(text).split(/\bWorlds\b/);
  return parts.flatMap((part, i) => (i === 0 ? [part] : [<Worlds key={i} />, part]));
}
