import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AGENTS, CONDITIONS, getSession } from "../data/sessions/index.js";
import { mulberry32 } from "../lib/prng.js";
import { track } from "../lib/analytics.ts";
import { WALKTHROUGH } from "../data/ui.js";
import { Section, Micro, H2, ctaPrimary } from "./ui.jsx";

const TICK_MS = WALKTHROUGH.tickMs;
const FLEET_TICK_MS = WALKTHROUGH.fleetTickMs;

// Fleet log derived deterministically from the session's own numbers. The
// failure spacing comes from the session's accuracy over its run count.
function buildFleetLog(session) {
  const rand = mulberry32(session.agent.length + session.condition.length);
  const failedRuns = Math.max(0, Math.round(((100 - session.stats.acc) / 100) * session.runs));
  const failuresInLog = Math.round((WALKTHROUGH.fleetLines * failedRuns) / session.runs);
  const failEvery =
    failuresInLog > 0 ? Math.max(2, Math.floor(WALKTHROUGH.fleetLines / failuresInLog)) : Infinity;
  const out = [];
  let id = 1;
  for (let i = 0; i < WALKTHROUGH.fleetLines; i++) {
    id += 1 + Math.floor(rand() * 12);
    const world = `world_${String(id).padStart(4, "0")}`;
    if (i > 4 && i % failEvery === 0) out.push({ x: `${world}  ${session.fleet.worst}`, hot: true });
    else out.push({ x: `${world}  ok · diff clean`, hot: false });
  }
  return out;
}

function Pane({ title, lines, done, hotIsContradiction, tag }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines.length]);
  return (
    <div className="relative min-w-0">
      <p className="label-mono text-[10px] text-gray-mid">{title}</p>
      {tag && (
        <span className="label-mono absolute top-0 right-0 text-[10px] text-gray-mid">{tag}</span>
      )}
      <div
        ref={ref}
        className="mt-2 h-52 overflow-y-auto rounded-[2px] border border-hairline bg-[#0a0a0a] p-3 font-mono text-xs leading-relaxed sm:h-56"
      >
        {lines.map((line, i) => (
          <p
            key={i}
            className={
              line.hot && hotIsContradiction
                ? "text-accent"
                : line.final && done
                  ? "text-fg"
                  : "text-gray-lt"
            }
          >
            {line.x}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Walkthrough() {
  const [agent, setAgent] = useState(AGENTS[0].key);
  const [condition, setCondition] = useState(CONDITIONS[0].key);
  const [mode, setMode] = useState("session");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const sectionRef = useRef(null);
  const inView = useRef(false);
  const failFired = useRef(false);

  const session = getSession(agent, condition);
  const fleetLog = useMemo(() => buildFleetLog(session), [session]);
  const total = mode === "session" ? session.lines.length : fleetLog.length;
  const done = step >= total && step > 0;

  const runsLabel = session.runs.toLocaleString("en-US");

  const select = (nextAgent, nextCondition) => {
    setAgent(nextAgent);
    setCondition(nextCondition);
    setMode("session");
    setStep(0);
    setPlaying(false);
    failFired.current = false;
  };

  const replay = (nextMode) => {
    setMode(nextMode);
    setStep(0);
    setPlaying(true);
    failFired.current = false;
    track("walkthrough_replayed", { agent, condition, mode: nextMode });
  };

  useEffect(() => {
    if (!playing) return;
    const ms = mode === "session" ? TICK_MS : FLEET_TICK_MS;
    const id = setInterval(() => setStep((p) => Math.min(p + 1, total)), ms);
    return () => clearInterval(id);
  }, [playing, mode, total]);

  useEffect(() => {
    if (playing && step >= total) setPlaying(false);
  }, [playing, step, total]);

  useEffect(() => {
    if (done && !session.pass && !failFired.current) {
      failFired.current = true;
      track("walkthrough_fail_seen", { agent, condition });
    }
  }, [done, session, agent, condition]);

  // Deep links: /#run=quoting:rate-limits selects and replays.
  useEffect(() => {
    const applyHash = () => {
      const m = window.location.hash.match(/^#run=([a-z]+):([a-z-]+)$/);
      if (!m) return;
      if (getSession(m[1], m[2])) {
        select(m[1], m[2]);
        setTimeout(() => {
          sectionRef.current?.scrollIntoView();
          setPlaying(true);
          track("walkthrough_replayed", { agent: m[1], condition: m[2], mode: "session" });
        }, 60);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // Keyboard cycling while the section is in view: arrows cycle, space replays.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.2 });
    if (sectionRef.current) io.observe(sectionRef.current);
    const onKey = (e) => {
      if (!inView.current) return;
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      const ai = AGENTS.findIndex((a) => a.key === agent);
      const ci = CONDITIONS.findIndex((c) => c.key === condition);
      if (e.key === "ArrowRight") select(AGENTS[(ai + 1) % AGENTS.length].key, condition);
      else if (e.key === "ArrowLeft") select(AGENTS[(ai + 3) % AGENTS.length].key, condition);
      else if (e.key === "ArrowDown") select(agent, CONDITIONS[(ci + 1) % CONDITIONS.length].key);
      else if (e.key === "ArrowUp") select(agent, CONDITIONS[(ci + 3) % CONDITIONS.length].key);
      else if (e.key === " ") replay("session");
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [agent, condition]);

  const complete = () => {
    if (playing) {
      setPlaying(false);
      setStep(total);
    }
  };

  const chip = (active) =>
    `label-mono shrink-0 rounded-[2px] border px-3 py-1.5 text-[11px] whitespace-nowrap ${
      active ? "border-accent text-accent" : "border-hairline text-gray-mid hover:text-fg"
    }`;

  const streamed = mode === "session" ? session.lines.slice(0, step) : fleetLog.slice(0, step);
  const lastTranscriptIdx = session.lines.map((l) => l.p).lastIndexOf("t");
  const transcriptLines = streamed
    .map((l, i) => ({ ...l, final: mode === "session" && i === lastTranscriptIdx }))
    .filter((l) => mode === "session" && l.p === "t");
  const worldLines = mode === "session" ? streamed.filter((l) => l.p === "w") : streamed;

  const stats = [
    ["ACTION ACCURACY", `${session.stats.acc.toFixed(1)}%`],
    ["UNAUTHORIZED ACTIONS", String(session.stats.unauth)],
    ["CHAOS GAP", session.stats.gap === null ? "N/A" : `${session.stats.gap.toFixed(1)} PT`],
  ];

  return (
    <Section>
      <div ref={sectionRef} title="Arrow keys switch agent and conditions. Space replays.">
        <Micro>WHAT A RUN LOOKS LIKE</Micro>
        <H2>Pick an agent. Pick the weather. Read the world.</H2>
        <p className="mt-4 max-w-[720px] text-base leading-[1.6] text-gray-mid">
          A coding agent can say it fixed a bug and still fail every test. An assistant can say
          your flight is booked when there is no row in the booking database. We do not read the
          story. We read the database. Every session reproduces to the byte.
        </p>

        <div className="mt-8 space-y-3">
          <div className="flex flex-wrap items-start gap-2">
            <span className="label-mono w-24 shrink-0 pt-2 text-[10px] text-gray-mid">AGENT</span>
            {AGENTS.map((a) => (
              <button key={a.key} type="button" onClick={() => select(a.key, condition)} aria-pressed={agent === a.key} className="flex shrink-0 flex-col items-center gap-1">
                <span className={chip(agent === a.key)}>{a.label}</span>
                <span className="font-mono text-[10px] tracking-[0.08em] text-gray-mid">{a.system}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-mono w-24 shrink-0 text-[10px] text-gray-mid">CONDITIONS</span>
            {CONDITIONS.map((c) => (
              <button key={c.key} type="button" onClick={() => select(agent, c.key)} aria-pressed={condition === c.key} className={chip(condition === c.key)}>
                {c.label}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={() => replay("session")} className="label-mono rounded-[2px] border border-[rgba(212,212,212,0.4)] px-4 py-2 text-xs text-fg hover:border-fg">
                REPLAY SESSION
              </button>
              <button type="button" onClick={() => replay("fleet")} className="label-mono rounded-[2px] border border-hairline px-4 py-2 text-xs text-gray-lt hover:border-gray-lt hover:text-fg">
                RUN {runsLabel}
              </button>
            </div>
          </div>
        </div>

        <div className="relative mt-6 grid gap-4 lg:grid-cols-2" onClick={complete}>
          {mode === "session" ? (
            <>
              <Pane title="TRANSCRIPT" lines={transcriptLines} done={done} hotIsContradiction={false} tag={session.illustrative ? "ILLUSTRATIVE" : null} />
              <Pane title="WORLD" lines={worldLines} done={done} hotIsContradiction={true} />
            </>
          ) : (
            <>
              <Pane title={`FLEET · ${runsLabel} WORLDS`} lines={worldLines} done={done} hotIsContradiction={true} tag={session.illustrative ? "ILLUSTRATIVE" : null} />
              <div className="min-w-0">
                <p className="label-mono text-[10px] text-gray-mid">FLEET VERDICT</p>
                <div className="mt-2 h-52 overflow-y-auto rounded-[2px] border border-hairline p-4 sm:h-56">
                  <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                    {stats.map(([label, value]) => (
                      <div key={label}>
                        <p className="label-mono text-[10px] text-gray-mid">{label}</p>
                        <p className="mt-1 font-mono text-xl tabular-nums text-gray-lt">{done ? value : "···"}</p>
                      </div>
                    ))}
                  </div>
                  {done && (
                    <>
                      <p className="mt-4 font-mono text-xs leading-relaxed text-accent">{session.fleet.worst}</p>
                      <p className="mt-3 text-sm leading-[1.6] text-gray-lt">{session.fleet.consequence}</p>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 z-10 mt-4 border border-hairline bg-bg p-4 lg:static">
          {/* One flex row, one shared vertical center line for every child. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-4">
              <span className={`shrink-0 font-sans text-[32px] leading-none font-bold tracking-[-0.02em] ${done ? (session.pass ? "text-fg" : "text-accent") : "text-gray-mid"}`}>
                {done ? (session.pass ? "PASS" : "FAIL") : "·"}
              </span>
              {done && (
                <p className="line-clamp-2 max-w-[46ch] text-sm leading-[1.4] text-gray-lt">
                  {session.consequence}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-col justify-center gap-1 text-left sm:ml-auto sm:text-right">
              <p className="label-mono text-[10px] leading-none text-gray-mid">
                {session.system} · {runsLabel} WORLDS · REPLAYS TO THE BYTE
              </p>
              <p className="label-mono text-[10px] leading-none text-gray-mid">
                REPLAY HASH {session.hash ?? "PENDING"}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-3 font-mono text-xs tracking-[0.02em] text-gray-mid">
          This is a replay of a recorded session. Runs reproduce to the byte; run it twice and compare the hash.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
          <p className="label-mono text-[10px] text-gray-mid">ACROSS {runsLabel} WORLDS</p>
          {stats.map(([label, value]) => (
            <p key={label} className="font-mono text-xs tracking-[0.08em] text-gray-mid">
              {label} <span className="text-gray-lt">{value}</span>
            </p>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/sign-in"
            onClick={() => track("cta_test_your_agent_clicked", { source: "walkthrough" })}
            className={ctaPrimary}
          >
            TEST YOUR OWN AGENT
          </Link>
          <p className="label-mono mt-3 text-xs text-gray-mid">
            Free. Any one world, your pick. Unlimited runs.
          </p>
        </div>
      </div>
    </Section>
  );
}
