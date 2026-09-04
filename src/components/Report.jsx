import sampleReport from "../data/sampleReport.json";
import ReportView from "./ReportView.jsx";
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

// Each bullet: a bold lead clause that carries the punch, then one short
// supporting sentence.
const BULLETS = [
  [
    "An agent can report success and corrupt state in the same run.",
    "That combination passes most tests and fails in production.",
  ],
  [
    "A refund issued in payments while the order still reads paid is two green checks and one broken business.",
    "Unlock more than one world and State Integrity is graded across systems, not inside each one.",
  ],
  [
    "CI mocks one service at a time.",
    "It cannot hold five real replicas in one state and tell you the set disagrees.",
  ],
  [
    "Sealed replicas, graded end to end.",
    "Including agent to agent handoffs, written for the buyer, the auditor and the security reviewer.",
  ],
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
            Two grades on every run. Most tools give you the first. Auditors ask about the second.
          </p>
          <ul className="mt-6 space-y-3 text-sm leading-[1.6] text-gray-lt">
            {BULLETS.map(([lead, support], i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden="true" className="mt-[7px] text-[10px] leading-none text-accent">
                  ●
                </span>
                <span>
                  <span className="font-medium text-fg">{lead}</span> {support}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[480px] text-base leading-[1.6] text-fg">
            Every record pins five values: agent build, model and version, environment snapshot,
            scenario set, run count. Anyone holding them can run it again and get the same answer.
            You are not trusting us. You are checking.
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
