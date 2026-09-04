import sampleReport from "../data/sampleReport.json";
import ReportView from "./ReportView.jsx";
import Worlds from "./Worlds.jsx";
import { Section, Micro, H2 } from "./ui.jsx";

const LIST = [
  ["COMPLETION", "did the agent finish the task it was given"],
  [
    "STATE INTEGRITY",
    "did it leave every system in the run correct, including the state they share, or did it break something on the way",
  ],
  [
    "AUDIT TRAIL",
    "seed, script, and diff for every run, exportable, signed into a public transparency log we do not operate",
  ],
];

const BULLETS = [
  <>An agent that reports success while corrupting state passes most tests and fails in production</>,
  <>
    Real agents touch more than one system. Unlock more than one world and they run together in
    one environment, so State Integrity is graded across systems: a refund issued in payments
    while the order still reads paid in your database is two passing checks and one broken
    business
  </>,
  <>
    CI can mock each service on its own. It cannot hold five real replicas in one consistent
    state and tell you the set is inconsistent
  </>,
  <>
    <Worlds /> runs your agent against sealed replicas instead, grades the whole chain including
    agent to agent handoffs, and writes the evidence for the buyer, the auditor, and the security
    reviewer
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
            matters most. Most tools give you the first number. Auditors ask about the second.
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
            Every record pins the agent build, the model and version, the environment snapshot,
            the scenario set, and the run count. Anyone holding those five values can run it again
            and get the same answer. You are not trusting us. You are checking.
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
