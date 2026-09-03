import { useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import sampleReport from "../data/sampleReport.json";
import ReportView from "../components/ReportView.jsx";
import Walkthrough from "../components/Walkthrough.jsx";
import { apiFetch } from "../lib/api.js";
import { track } from "../lib/analytics.ts";
import { hasClerk, AuthPending } from "../lib/clerk.jsx";
import { Micro, ctaGhost, ctaPrimary } from "../components/ui.jsx";

function InviteEngineer() {
  const { getToken } = useAuth();
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");

  const send = async (e) => {
    e.preventDefault();
    if (!email) return;
    setState("sending");
    try {
      await apiFetch("/api/invite", { getToken, method: "POST", body: { email } });
      track("invite_engineer_sent", {});
      setState("sent");
      setEmail("");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>INVITE YOUR ENGINEER</Micro>
      <p className="mt-4 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
        The claim flow and the key live on the engineering side. Send it over; they can wire an agent
        in an afternoon.
      </p>
      <form onSubmit={send} className="mt-6 flex max-w-md gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ENGINEER@COMPANY.COM"
          aria-label="Engineer email"
          className="w-full flex-1 rounded-[2px] border border-hairline bg-bg px-3 py-2 font-mono text-sm tracking-[0.08em] placeholder:text-gray-mid"
        />
        <button type="submit" disabled={state === "sending"} className={`${ctaGhost} shrink-0`}>
          {state === "sending" ? "SENDING" : "SEND"}
        </button>
      </form>
      {state === "sent" && <p className="label-mono mt-3 text-xs text-gray-mid">SENT.</p>}
      {state === "error" && (
        <p className="label-mono mt-3 text-xs text-gray-mid">COULD NOT SEND. TRY AGAIN.</p>
      )}
      <Link to="/claim" className={`${ctaGhost} mt-8 inline-block`}>
        OR CLAIM A WORLD YOURSELF
      </Link>
    </div>
  );
}

export default function Overview() {
  if (!hasClerk) return <AuthPending />;
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <main>
          <div className="mx-auto max-w-[1120px] px-4 pt-16 sm:px-6 md:pt-24">
            <Micro>OVERVIEW</Micro>
            <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
              What your team gets.
            </h1>
            <div className="mt-8 max-w-[720px]">
              <ReportView report={sampleReport} watermark="SAMPLE" />
            </div>
            <div className="mt-8">
              <Link
                to="/claim"
                onClick={() => track("cta_test_your_agent_clicked", { source: "overview" })}
                className={ctaPrimary}
              >
                CLAIM A WORLD
              </Link>
            </div>
          </div>
          <Walkthrough />
          <InviteEngineer />
        </main>
      </SignedIn>
    </>
  );
}
