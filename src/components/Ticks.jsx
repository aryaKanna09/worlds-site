// The Sparta registration mark: 10x22px solid rectangles pinned to corners.
// `corners` allows asymmetric placement (e.g. ["tl","bl"] for a margin-note look).
const POS = {
  tl: "-top-px -left-px",
  bl: "-bottom-px -left-px",
  tr: "-top-px -right-px",
  br: "-bottom-px -right-px",
};

export default function Ticks({ className = "", corners = ["tl", "bl", "tr", "br"] }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {corners.map((c) => (
        <div key={c} className={`absolute h-[22px] w-[10px] bg-accent ${POS[c]}`} />
      ))}
    </div>
  );
}
