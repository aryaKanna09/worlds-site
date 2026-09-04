import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { update, useMockSession } from "../lib/mock.js";
import { track } from "../lib/analytics.ts";
import { Micro, ctaGhost } from "../components/ui.jsx";

const ROLES = ["I BUILD AGENTS", "RISK OR COMPLIANCE", "LEADERSHIP", "JUST LOOKING"];
const VERTICALS = ["SUPPORT", "BILLING", "OPS", "OTHER"];

function Question({ label, options, onPick }) {
  return (
    <div className="mt-10">
      <p className="label-mono text-xs text-gray-mid">{label}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onPick(o)}
            className="label-mono rounded-[2px] border border-hairline px-4 py-2.5 text-xs text-gray-lt hover:border-gray-lt hover:text-fg"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Welcome() {
  const navigate = useNavigate();
  const session = useMockSession();
  const [role, setRole] = useState(null);

  if (!session?.signedIn) return <Navigate to="/sign-in" replace />;

  const finish = (finalRole, vertical) => {
    track("role_answered", { role: finalRole, vertical: vertical ?? null });
    update({ role: finalRole, vertical: vertical ?? null });
    navigate(finalRole === "I BUILD AGENTS" ? "/claim" : "/overview");
  };

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>WELCOME</Micro>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
        Two questions. Both optional.
      </h1>

      {role === null ? (
        <Question
          label="WHAT BRINGS YOU HERE"
          options={ROLES}
          onPick={(r) => (r === "I BUILD AGENTS" ? setRole(r) : finish(r, null))}
        />
      ) : (
        <Question label="WHAT DO YOUR AGENTS TOUCH" options={VERTICALS} onPick={(v) => finish(role, v)} />
      )}

      <button type="button" onClick={() => finish(role, null)} className={`${ctaGhost} mt-10`}>
        SKIP
      </button>
    </main>
  );
}
