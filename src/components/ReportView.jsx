import Ticks from "./Ticks.jsx";

const Pending = () => <span className="text-gray-mid">PENDING</span>;

// The one report renderer. Every run carries two grades: Completion and
// State Integrity.
export default function ReportView({ report, watermark }) {
  return (
    <div className="relative rounded-[2px] border border-hairline p-6 font-mono text-sm leading-relaxed sm:p-8">
      <Ticks corners={["tl", "bl"]} />
      {watermark && (
        <span className="label-mono absolute top-4 right-4 text-[10px] text-gray-mid">{watermark}</span>
      )}
      <p className="tracking-[0.08em] text-fg uppercase">ACTION ACCURACY REPORT</p>
      <div className="mt-6 grid grid-cols-[150px_1fr] gap-y-2">
        <span className="tracking-[0.08em] text-gray-mid">AGENT</span>
        <span className="text-gray-lt">{report.agent}</span>
        <span className="tracking-[0.08em] text-gray-mid">ENVIRONMENT</span>
        <span className="text-gray-lt">{report.environmentName}</span>
        <span className="tracking-[0.08em] text-gray-mid">COMPLETION</span>
        <span className="text-gray-lt">
          {report.completion} across {report.runs.toLocaleString("en-US")} runs
        </span>
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
        <span className="tracking-[0.08em] text-gray-mid">REPLAY HASH</span>
        <span className="text-gray-lt">{report.replayHash ?? <Pending />}</span>
        <span className="tracking-[0.08em] text-gray-mid">PRODUCED BY</span>
        <span className="text-gray-lt">{report.producedBy}</span>
      </div>
    </div>
  );
}
