// Shared section primitives: 64px mobile / 96px desktop vertical padding, 1120px content width.
// `padding` lets a section own a custom boundary (e.g. the shared hairline between scorecard and why-now).
export function Section({ id, className = "", padding = "py-16 md:py-24", children }) {
  return (
    <section id={id} className={`${padding} ${className}`}>
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function Micro({ children, className = "" }) {
  return <p className={`label-mono text-xs text-gray-mid ${className}`}>{children}</p>;
}

export function H2({ children, className = "" }) {
  return (
    <h2 className={`mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl ${className}`}>
      {children}
    </h2>
  );
}

// Calm button vocabulary: no solid fills, hairline borders, quiet hovers.
export const ctaPrimary =
  "label-mono inline-block whitespace-nowrap rounded-[2px] border border-[rgba(212,212,212,0.4)] px-5 py-2.5 text-xs text-fg hover:border-fg";
export const ctaGhost =
  "label-mono inline-block whitespace-nowrap rounded-[2px] border border-hairline px-4 py-2 text-xs text-gray-lt hover:border-gray-lt hover:text-fg";
