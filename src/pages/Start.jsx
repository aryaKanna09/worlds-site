import { useEffect, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { apiFetch } from "../lib/api.js";
import { track } from "../lib/analytics.ts";
import { COPY_FLASH_MS } from "../data/ui.js";
import { hasClerk, AuthPending } from "../lib/clerk.jsx";
import { Micro, ctaGhost } from "../components/ui.jsx";

function CopyBlock({ text, onCopy, mono = true }) {
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
      <code className={`min-w-0 truncate ${mono ? "font-mono" : ""} text-sm text-gray-lt`}>{text}</code>
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

function StartInner() {
  const { getToken } = useAuth();
  const [me, setMe] = useState(null);
  const [key, setKey] = useState(null);
  const [masked, setMasked] = useState(false);
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    apiFetch("/api/accounts/me", { getToken }).then(setMe).catch(() => setMe({ error: true }));
    apiFetch("/api/keys/current", { getToken })
      .then((d) => {
        setKey(d.key);
        const seen = localStorage.getItem(`worlds_key_seen_${d.key.tokenId}`);
        if (seen) setMasked(true);
        else localStorage.setItem(`worlds_key_seen_${d.key.tokenId}`, "1");
      })
      .catch(() => setKey(null));
  }, [getToken]);

  const renew = async () => {
    setRenewing(true);
    try {
      const d = await apiFetch("/api/keys/renew", { getToken, method: "POST" });
      setKey(d.key);
      setMasked(false);
      localStorage.setItem(`worlds_key_seen_${d.key.tokenId}`, "1");
      track("key_renewed", { tier: d.key.tier });
    } finally {
      setRenewing(false);
    }
  };

  const provisioning = me?.claim?.status === "provisioning";
  const displayToken = key ? (masked ? `${key.token.slice(0, 12)}············` : key.token) : null;

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>START</Micro>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
        Two doors. Take them in order.
      </h1>

      <section className="mt-10 rounded-[2px] border border-hairline p-6 sm:p-8">
        <button
          type="button"
          onClick={() => track("start_door_opened", { door: "demo" })}
          className="label-mono text-xs text-fg"
        >
          01 · SEE IT CATCH A BUG
        </button>
        <p className="mt-3 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
          Keyless. You'll watch a refund agent double refund a customer under rate limits, and the diff
          that catches it.
        </p>
        <div className="mt-4 max-w-md">
          <CopyBlock text="npx twinlab demo" onCopy={() => track("start_door_opened", { door: "demo" })} />
        </div>
      </section>

      <section className="mt-6 rounded-[2px] border border-hairline p-6 sm:p-8">
        <button
          type="button"
          onClick={() => track("start_door_opened", { door: "wire" })}
          className="label-mono text-xs text-fg"
        >
          02 · WIRE YOUR AGENT
        </button>
        {provisioning ? (
          <p className="mt-3 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
            Your {me?.world?.name || me?.claim?.worldSlug} world is being prepared. You'll have it
            shortly. Door one works right now.
          </p>
        ) : key ? (
          <>
            <p className="label-mono mt-4 text-[10px] text-gray-mid">YOUR KEY</p>
            <div className="mt-2 max-w-2xl">
              <CopyBlock text={displayToken} onCopy={() => track("key_copied", {})} />
            </div>
            <p className="label-mono mt-2 text-[10px] text-gray-mid">
              EXPIRES {new Date(key.expiresAt).toISOString().slice(0, 10)}
              <button type="button" onClick={renew} disabled={renewing} className="ml-3 text-gray-lt hover:text-fg">
                {renewing ? "RENEWING" : "RENEW"}
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

      <a href="/dashboard" className={`${ctaGhost} mt-8 inline-block`}>
        GO TO DASHBOARD
      </a>
    </main>
  );
}

export default function Start() {
  if (!hasClerk) return <AuthPending />;
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <StartInner />
      </SignedIn>
    </>
  );
}
