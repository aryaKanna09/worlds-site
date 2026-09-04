// The product name in running copy: the whole word in brand orange. One text
// flow, no word break, so screen readers say "Worlds" as a single word.
export default function Worlds({ className = "" }) {
  return <span className={`text-accent ${className}`}>Worlds</span>;
}

// For copy that lives in data files: splits on the product name and applies
// the treatment without hardcoding markup at every mention.
export function withWorlds(text) {
  const parts = String(text).split(/\bWorlds\b/);
  return parts.flatMap((part, i) => (i === 0 ? [part] : [<Worlds key={i} />, part]));
}
