import sampleReport from "../data/sampleReport.json";
import ReportView from "./ReportView.jsx";
import { Section, Micro } from "./ui.jsx";

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

// The value prop bullets stand on their own; the signed record follows as the
// workflow's output, deliberately smaller than a pillar section.
export default function Report() {
  return (
    <Section>
      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-2">
        {BULLETS.map(([lead, support], i) => (
          <p key={i} className="max-w-[52ch] text-lg leading-[1.6] text-gray-lt">
            <span className="font-medium text-fg">{lead}</span> {support}
          </p>
        ))}
      </div>

      <div className="mt-16 border-t border-hairline pt-10">
        <Micro>WHAT YOU GET AT THE END</Micro>
        <p className="mt-3 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
          Two grades on every run, one for what finished, one for what broke.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <ReportView report={sampleReport} watermark="SAMPLE" compact />
          <div className="flex flex-col">
            <p className="max-w-[480px] text-base leading-[1.6] text-fg">
              Every record pins five values: agent build, model and version, environment snapshot,
              scenario set, run count. Anyone holding them can run it again and get the same
              answer. You are not trusting us. You are checking.
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
      </div>
    </Section>
  );
}
