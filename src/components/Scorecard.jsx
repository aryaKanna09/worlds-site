import { useEffect, useMemo, useState } from "react";
import {
  agents,
  CONDITIONS,
  buildLog,
  failCount,
  replayHash,
  PASS_THRESHOLD,
  RUNS_PER_GRADE,
  STREAM_MS,
} from "../data/scenarios.js";
import { Section, Micro, H2 } from "./ui.jsx";

const ease = (t) => 1 - Math.pow(1 - t, 3);

export default function Scorecard() {
  const [agentKey, setAgentKey] = useState(agents[0].key);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  const agent = agents.find((a) => a.key === agentKey);
  const numbers = agent.conditions[condition];
  const log = useMemo(() => buildLog(agent, condition), [agent, condition]);
  const done = step > 0 && step >= log.length;
  const progress = step / log.length;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setStep((p) => Math.min(p + 1, log.length)), STREAM_MS / log.length);
    return () => clearInterval(id);
  }, [running, log]);

  useEffect(() => {
    if (running && step >= log.length) setRunning(false);
  }, [running, step, log]);

  const pick = (setter) => (value) => {
    setter(value);
    setRunning(false);
    setStep(0);
  };
  const pickAgent = pick(setAgentKey);
  const pickCondition = pick(setCondition);

  const run = () => {
    setStep(0);
    setRunning(true);
  };

  const val = (final, decimals) =>
    step === 0 ? (0).toFixed(decimals) : (final * (done ? 1 : ease(progress))).toFixed(decimals);

  const metrics = [
    ["ACTION ACCURACY", `${val(numbers.acc, 1)}%`],
    ["UNAUTHORIZED ACTIONS", val(numbers.unauth, 0)],
    ["CHAOS GAP", numbers.gap === null ? "N/A" : `${val(numbers.gap, 1)} PT`],
  ];

  // Verdict and consequence are computed from the numbers, never hardcoded.
  const pass = numbers.acc >= PASS_THRESHOLD && numbers.unauth === 0;
  const n = failCount(numbers.acc);
  const [beforeN, afterN] = agent.consequence.split("{n}");
  const visible = log.slice(Math.max(0, step - 40), step);
  const runsLabel = RUNS_PER_GRADE.toLocaleString("en-US");
  const chip = (active) =>
    `label-mono shrink-0 rounded-[2px] border px-3 py-1.5 text-[11px] whitespace-nowrap ${
      active ? "border-accent text-accent" : "border-hairline text-gray-mid hover:text-fg"
    }`;

  return (
    <Section>
      <Micro>WHAT A RUN LOOKS LIKE</Micro>
      <H2>Pick an agent. Pick the weather. Read the world.</H2>

      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono w-24 shrink-0 text-[10px] text-gray-mid">AGENT</span>
          {agents.map((a) => (
            <button key={a.key} type="button" onClick={() => pickAgent(a.key)} aria-pressed={agentKey === a.key} className={chip(agentKey === a.key)}>
              {a.key}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono w-24 shrink-0 text-[10px] text-gray-mid">CONDITIONS</span>
          {CONDITIONS.map((c) => (
            <button key={c} type="button" onClick={() => pickCondition(c)} aria-pressed={condition === c} className={chip(condition === c)}>
              {c}
            </button>
          ))}
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="label-mono ml-auto rounded-[2px] border border-[rgba(212,212,212,0.4)] px-4 py-2 text-xs text-fg hover:border-fg disabled:opacity-60"
          >
            {running ? "RUNNING" : `RUN ${runsLabel}`}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <div
          className="h-80 overflow-hidden rounded-[2px] border border-hairline bg-[#0a0a0a] p-4 font-mono text-xs leading-relaxed"
          aria-label="Run log"
        >
          {step === 0 ? (
            <p className="text-gray-mid">AWAITING RUN</p>
          ) : (
            visible.map((line, i) => (
              <p key={`${line.text}-${i}`} className={line.hot ? "text-accent" : "text-gray-lt"}>
                {line.text}
              </p>
            ))
          )}
        </div>

        <div className="flex flex-col rounded-[2px] border border-hairline p-5">
          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            {metrics.map(([label, value]) => (
              <div key={label}>
                <p className="label-mono text-[10px] text-gray-mid">{label}</p>
                <p className="mt-1 font-mono text-xl tabular-nums text-gray-lt">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-6">
            {done &&
              (pass ? (
                <p className="label-mono text-sm text-fg">PASS</p>
              ) : (
                <div>
                  <p className="label-mono text-sm text-accent">FAIL</p>
                  <p className="mt-2 text-base leading-[1.6] text-gray-lt">
                    {beforeN}
                    <span className="font-mono">{n}</span>
                    {afterN}
                  </p>
                </div>
              ))}
            <p className="label-mono mt-4 text-[10px] text-gray-mid/70">
              {agent.worlds.join(", ").toUpperCase()} · {runsLabel} WORLDS · BYTE-IDENTICAL REPLAY
            </p>
            <p className="label-mono mt-2 text-[10px] text-gray-mid/70">
              REPLAY HASH {replayHash ?? <span className="text-gray-mid">PENDING</span>}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 max-w-[720px] text-lg leading-[1.6] text-gray-lt">
        Every result on this page reproduces to the byte. Run it twice and compare the hash.
      </p>
    </Section>
  );
}
