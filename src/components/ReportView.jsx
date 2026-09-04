import Ticks from "./Ticks.jsx";

const Pending = () => <span className="text-gray-mid">PENDING</span>;

// The one record renderer. Five pinned values, two grades, an expiry. It reads
// as a build artifact, never as a diploma: no seals, no badges.
export default function ReportView({ report, watermark }) {
  return (
    <div className="relative rounded-[2px] border border-hairline p-6 font-mono text-sm leading-relaxed sm:p-8">
      <Ticks corners={["tl", "bl"]} />
      {watermark && (
        <span className="label-mono absolute top-4 right-4 text-[10px] text-gray-mid">{watermark}</span>
      )}
      <p className="tracking-[0.08em] text-fg uppercase">SIGNED RECORD</p>
      <div className="mt-6 grid grid-cols-[150px_1fr] gap-y-2">
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
          {report.movement.map(([category, value]) => (
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
