import Ticks from "./Ticks.jsx";
import { report } from "../data/report.js";
import { Section, Micro, H2 } from "./ui.jsx";

const LIST = [
  ["POLICY COVERAGE", "every refund limit, discount cap, access rule, and approval threshold encoded as a test"],
  ["VERSION HISTORY", "which agent versions were run, which regressed, and on what"],
  ["AUDIT TRAIL", "seed, script, and diff for every run, exportable"],
];

const Pending = () => <span className="text-gray-mid">PENDING</span>;

export default function Report() {
  return (
    <Section>
      <Micro>THE REPORT</Micro>
      <H2>A record of what your agent did. Not what it said.</H2>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="relative rounded-[2px] border border-hairline p-6 font-mono text-sm leading-relaxed sm:p-8">
          <Ticks corners={["tl", "bl"]} />
          <p className="tracking-[0.08em] text-fg uppercase">ACTION ACCURACY REPORT</p>
          <div className="mt-6 grid grid-cols-[150px_1fr] gap-y-2">
            <span className="tracking-[0.08em] text-gray-mid">AGENT</span>
            <span className="text-gray-lt">{report.agent}</span>
            <span className="tracking-[0.08em] text-gray-mid">ENVIRONMENT</span>
            <span className="text-gray-lt">{report.environmentName}</span>
            <span className="tracking-[0.08em] text-gray-mid">ACTION ACCURACY</span>
            <span className="text-gray-lt">
              {report.accuracy} across {report.runs.toLocaleString("en-US")} runs
            </span>
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

        <div className="flex flex-col">
          <p className="max-w-[480px] text-lg leading-[1.6] text-gray-lt">
            Every run is reproducible from a seed and a script. Every number comes from the world's final
            state, never from the agent's own account of itself. Hand it to your customer, your insurer, or
            your regulator.
          </p>
          <div className="mt-8 divide-y divide-hairline border-y border-hairline">
            {LIST.map(([label, text]) => (
              <div key={label} className="grid grid-cols-1 gap-1 py-3 font-mono text-xs text-gray-mid sm:grid-cols-[160px_1fr] sm:gap-4">
                <span className="tracking-[0.08em]">{label}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
