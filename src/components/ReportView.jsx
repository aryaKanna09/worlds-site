import Ticks from "./Ticks.jsx";

const Pending = () => <span className="text-gray-mid">PENDING</span>;

// The one record renderer. Five pinned values, two grades, an expiry. It reads
// as a build artifact, never as a diploma: no seals, no badges. `compact`
// halves the vertical footprint for the closing artifact treatment.
export default function ReportView({ report, watermark, compact = false }) {
  return (
    <div
      className={`relative rounded-[2px] border border-hairline font-mono leading-relaxed ${
        compact ? "p-4 text-xs sm:p-5" : "p-6 text-sm sm:p-8"
      }`}
    >
      <Ticks corners={["tl", "bl"]} />
      {watermark && (
        <span className="label-mono absolute top-4 right-4 text-[10px] text-gray-mid">{watermark}</span>
      )}
      <p className="tracking-[0.08em] text-fg uppercase">SIGNED RECORD</p>
      <div className={`grid gap-y-1.5 ${compact ? "mt-4 grid-cols-[120px_1fr]" : "mt-6 gap-y-2 grid-cols-[150px_1fr]"}`}>
        <span className="tracking-[0.08em] text-gray-mid">AGENT BUILD</span>
        <span className="text-gray-lt">{report.agentBuild}</span>
        <span className="tracking-[0.08em] text-gray-mid">MODEL</span>
        <span className="text-gray-lt">{report.model ?? <Pending />}</span>
        <span className="tracking-[0.08em] text-gray-mid">ENVIRONMENT</span>
        <span className="text-gray-lt">
          {report.environment} · snapshot {report.snapshot ?? <Pending />}
        </span>
        <span className="tracking-[0.08em] text-gray-mid">SCENARIO SET</span>
        <span className="text-gray-lt">{report.scenarioSet ?? <Pending />}</span>
        <span className="tracking-[0.08em] text-gray-mid">RUN COUNT</span>
        <span className="text-gray-lt">{report.runs.toLocaleString("en-US")}</span>
        <span className="tracking-[0.08em] text-gray-mid">COMPLETION</span>
        <span className="text-gray-lt">{report.completion}</span>
        <span className="tracking-[0.08em] text-gray-mid">STATE INTEGRITY</span>
        <span className="text-gray-lt">{report.stateIntegrity}</span>
        <span className="tracking-[0.08em] text-gray-mid">MOVEMENT</span>
        <span className="text-gray-lt">
          {compact
            ? report.movement.map(([category, value]) => `${category} ${value}`).join(" · ")
            : report.movement.map(([category, value]) => (
                <span key={category} className="block">
                  {category} {value}
                </span>
              ))}
        </span>
        <span className="tracking-[0.08em] text-gray-mid">EXPIRES</span>
        <span className="text-gray-lt">{report.expires}</span>
        <span className="tracking-[0.08em] text-gray-mid">PRODUCED BY</span>
        <span className="text-gray-lt">{report.producedBy}</span>
      </div>
    </div>
  );
}
