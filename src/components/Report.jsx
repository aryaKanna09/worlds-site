import sampleReport from "../data/sampleReport.json";
import ReportView from "./ReportView.jsx";
import Worlds from "./Worlds.jsx";
import { Section, Micro, H2 } from "./ui.jsx";

const LIST = [
  ["COMPLETION", "did the agent finish the task it was given"],
  ["STATE INTEGRITY", "did it leave the environment correct, or did it break something on the way"],
  ["AUDIT TRAIL", "seed, script, and diff for every run, exportable"],
];

export default function Report() {
  return (
    <Section>
      <Micro>THE REPORT</Micro>
      <H2>A record of what your agent did. Not what it said.</H2>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <ReportView report={sampleReport} watermark="SAMPLE" />
        <div className="flex flex-col">
          <p className="max-w-[480px] text-lg leading-[1.6] text-gray-lt">
            Every run produces two grades. A single pass rate hides the failure that matters most: an
            agent that reports success while corrupting state passes most tests and fails in production.
            State Integrity covers the whole run, not the final snapshot. Every write, every call, every
            record the agent touched and then tidied up. Your CI cannot run your suite against real
            Stripe or real Salesforce, and a green check is written for your team. <Worlds /> runs your
            agent against a full replica of the systems it touches and writes the evidence for the
            buyer, the auditor, and the security reviewer. It claims one thing: this agent performed
            this task under these conditions on this date. Independent evidence, repeatable on demand.
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
