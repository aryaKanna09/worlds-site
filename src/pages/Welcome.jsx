import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { apiFetch } from "../lib/api.js";
import { track, identify } from "../lib/analytics.ts";
import { hasClerk, AuthPending } from "../lib/clerk.jsx";
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

function WelcomeInner() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [role, setRole] = useState(null);
  const signupFired = useRef(false);

  useEffect(() => {
    if (!user || signupFired.current) return;
    signupFired.current = true;
    const provider = user.externalAccounts?.[0]?.provider || "email";
    track("signup_completed", { provider });
  }, [user]);

  const finish = async (finalRole, vertical) => {
    track("role_answered", { role: finalRole, vertical: vertical ?? null });
    try {
      const account = await apiFetch("/api/accounts/answers", {
        getToken,
        method: "POST",
        body: { role: finalRole, vertical: vertical ?? null },
      });
      if (account?.id) identify(account.id, { role_answer: finalRole, vertical_answer: vertical ?? null });
    } catch {
      // Routing is a default, never a wall; continue even if the write fails.
    }
    navigate(finalRole === "I BUILD AGENTS" ? "/claim" : "/overview");
  };

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>WELCOME</Micro>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
        Two questions. Both optional.
      </h1>

      {role === null ? (
        <Question label="WHAT BRINGS YOU HERE" options={ROLES} onPick={(r) => {
          if (r === "I BUILD AGENTS") setRole(r);
          else finish(r, null);
        }} />
      ) : (
        <Question label="WHAT DO YOUR AGENTS TOUCH" options={VERTICALS} onPick={(v) => finish(role, v)} />
      )}

      <button type="button" onClick={() => finish(role, null)} className={`${ctaGhost} mt-10`}>
        SKIP
      </button>
    </main>
  );
}

export default function Welcome() {
  if (!hasClerk) return <AuthPending />;
  return <WelcomeInner />;
}
