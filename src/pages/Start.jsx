import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getSession, update, useMockSession, issuePlaceholderKey } from "../lib/mock.js";
import { track } from "../lib/analytics.ts";
import { COPY_FLASH_MS } from "../data/ui.js";
import { Micro, ctaGhost } from "../components/ui.jsx";

function CopyBlock({ text, onCopy }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), COPY_FLASH_MS);
    });
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-[2px] border border-hairline bg-[#0a0a0a] px-4 py-3">
      <code className="min-w-0 truncate font-mono text-sm text-gray-lt">{text}</code>
      <button
        type="button"
        onClick={copy}
        className={`label-mono shrink-0 text-xs ${copied ? "text-accent" : "text-gray-mid hover:text-fg"}`}
      >
        {copied ? "COPIED" : "COPY"}
      </button>
    </div>
  );
}

export default function Start() {
  const session = useMockSession();
  // Shown in full on the first visit, masked on later ones.
  const [masked, setMasked] = useState(() => Boolean(getSession()?.keySeen));

  useEffect(() => {
    if (session?.signedIn && session.key && !session.keySeen) update({ keySeen: true });
  }, [session?.key?.token]);

  if (!session?.signedIn) return <Navigate to="/sign-in" replace />;

  const key = session.key;
  const provisioning = session.claim?.status === "provisioning";

  const renew = () => {
    update({ key: issuePlaceholderKey(key?.channel || "stable"), keySeen: true });
    setMasked(false);
    track("key_renewed", { tier: "free" });
  };

  const displayToken = key ? (masked ? `${key.token.slice(0, 12)}············` : key.token) : null;

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>START</Micro>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
        Two doors. Take them in order.
      </h1>

      <section className="mt-10 rounded-[2px] border border-hairline p-6 sm:p-8">
        <p className="label-mono text-xs text-fg">01 · SEE IT CATCH A BUG</p>
        <p className="mt-3 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
          Keyless. You'll watch a refund agent double refund a customer under rate limits, and the diff
          that catches it.
        </p>
        <div className="mt-4 max-w-md">
          <CopyBlock text="npx twinlab demo" onCopy={() => track("start_door_opened", { door: "demo" })} />
        </div>
      </section>

      <section className="mt-6 rounded-[2px] border border-hairline p-6 sm:p-8">
        <p className="label-mono text-xs text-fg">02 · WIRE YOUR AGENT</p>
        {provisioning ? (
          <p className="mt-3 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
            Your {session.claim.name} world is being prepared. You'll have it shortly. Door one works
            right now.
          </p>
        ) : key ? (
          <>
            <p className="label-mono mt-4 text-[10px] text-gray-mid">YOUR KEY</p>
            <div className="mt-2 max-w-2xl">
              <CopyBlock text={displayToken} onCopy={() => track("key_copied", {})} />
            </div>
            <p className="label-mono mt-2 text-[10px] text-gray-mid">
              EXPIRES {new Date(key.expiresAt).toISOString().slice(0, 10)}
              <button type="button" onClick={renew} className="ml-3 text-gray-lt hover:text-fg">
                RENEW
              </button>
            </p>
            <div className="mt-4 max-w-md space-y-2">
              <CopyBlock text="npx twinlab activate <key>" />
              <CopyBlock text="npx twinlab init" />
            </div>
            <p className="mt-4 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
              Everything else is generated. Two things are yours: confirm your agent reads the injected
              env vars, and write your business rules as assertions.
            </p>
          </>
        ) : (
          <p className="label-mono mt-3 text-xs text-gray-mid">NO KEY YET · CLAIM A WORLD FIRST</p>
        )}
      </section>

      <Link to="/dashboard" className={`${ctaGhost} mt-8 inline-block`}>
        GO TO DASHBOARD
      </Link>
    </main>
  );
}
