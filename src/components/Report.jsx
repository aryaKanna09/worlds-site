import sampleReport from "../data/sampleReport.json";
import ReportView from "./ReportView.jsx";
import Worlds from "./Worlds.jsx";
import { Section, Micro, H2 } from "./ui.jsx";

const LIST = [
  ["COMPLETION", "did the agent finish the task it was given"],
  ["STATE INTEGRITY", "did it leave the environment correct, or did it break something on the way"],
  ["AUDIT TRAIL", "seed, script, and diff for every run, exportable"],
];

const BULLETS = [
  <>An agent that reports success while corrupting state passes most tests and fails in production</>,
  <>
    State Integrity covers the whole run, not the final snapshot: every write, every call, every
    record touched and tidied up
  </>,
  <>Your CI can't run against real Stripe or real Salesforce, so a green check today gets written on faith</>,
  <>
    <Worlds /> runs your agent against a full replica instead, and writes the evidence for the
    buyer, the auditor, and the security reviewer
  </>,
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
            Every run produces two grades, because a single pass rate hides the failure that
            matters most.
          </p>
          <ul className="mt-6 max-w-[480px] space-y-3 text-base leading-[1.6] text-gray-lt">
            {BULLETS.map((text, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden="true" className="mt-[7px] text-[10px] leading-none text-accent">
                  ●
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[480px] text-base leading-[1.6] text-fg">
            One claim: this agent performed this task under these conditions on this date.
            Independent evidence, repeatable on demand.
          </p>
          <dl className="mt-8 divide-y divide-hairline border-y border-hairline">
            {LIST.map(([label, text]) => (
              <div key={label} className="grid grid-cols-1 gap-1 py-3 font-mono text-xs text-gray-mid sm:grid-cols-[160px_1fr] sm:gap-4">
                <dt className="tracking-[0.08em]">{label}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
