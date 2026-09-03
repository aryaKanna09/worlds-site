import Ticks from "./Ticks.jsx";

const ENTRIES = [
  ["I.", "n.", "A rule-faithful copy of a system an agent acts on. Same URLs, same errors, same state machine. No real money, no real customers, no real consequences."],
  ["II.", "v.", "To run an agent somewhere its mistakes are free."],
];

// Bare dictionary block, 720px, asymmetric ticks. Rendered by the footer.
export default function Definition() {
  return (
    <div className="relative max-w-[720px] p-6 sm:p-8">
      <Ticks corners={["tl", "bl"]} />
      <p className="font-sans text-xl font-medium sm:text-2xl">
        world<sup className="font-mono text-sm text-accent">1</sup>
      </p>
      <p className="mt-1 font-mono text-sm text-gray-mid">/wərld/</p>
      <div className="mt-10 space-y-6">
        {ENTRIES.map(([num, pos, text]) => (
          <div key={num} className="flex gap-4">
            <span className="w-7 shrink-0 font-mono text-sm text-gray-mid">{num}</span>
            <span className="w-5 shrink-0 font-mono text-sm text-gray-mid">{pos}</span>
            <p className="leading-[1.6] text-gray-lt">{text}</p>
          </div>
        ))}
      </div>
      <p className="mt-12 font-mono text-[13px] leading-relaxed text-gray-mid">
        <sup className="text-accent">1</sup> Also see: Sparta, where soldiers were tested before they were
        trusted.
      </p>
    </div>
  );
}
