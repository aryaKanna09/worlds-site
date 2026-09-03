import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { apiFetch } from "../lib/api.js";
import { track } from "../lib/analytics.ts";
import PatchNotes from "../components/PatchNotes.jsx";
import { hasClerk, AuthPending } from "../lib/clerk.jsx";
import { Micro, ctaGhost } from "../components/ui.jsx";

function DashboardInner() {
  const { getToken } = useAuth();
  const [me, setMe] = useState(null);
  const [verifications, setVerifications] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    apiFetch("/api/accounts/me", { getToken }).then(setMe).catch(() => setMe({ error: true }));
    apiFetch("/api/verifications", { getToken })
      .then((d) => setVerifications(d.verifications))
      .catch(() => setVerifications([]));
  };
  useEffect(load, [getToken]);

  const renew = async (channel) => {
    setBusy(true);
    try {
      const d = await apiFetch("/api/keys/renew", { getToken, method: "POST", body: channel ? { channel } : undefined });
      if (channel) track("channel_changed", { to: channel });
      track("key_renewed", { tier: d.key.tier });
      load();
    } finally {
      setBusy(false);
    }
  };

  const worldSlug = me?.claim?.worldSlug;
  const channel = me?.key?.channel || "stable";

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>DASHBOARD</Micro>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section>
          <p className="label-mono text-xs text-gray-mid">YOUR WORLD</p>
          {me?.claim ? (
            <div className="mt-4 rounded-[2px] border border-hairline p-5">
              <p className="font-sans text-lg font-medium">{me.world?.name || worldSlug}</p>
              <p className="label-mono mt-2 text-[10px] text-gray-mid">
                STATUS {me.claim.status.toUpperCase()}
              </p>
              {me.key && (
                <>
                  <p className="label-mono mt-1 text-[10px] text-gray-mid">
                    KEY EXPIRES {new Date(me.key.expiresAt).toISOString().slice(0, 10)}
                  </p>
                  <button type="button" onClick={() => renew()} disabled={busy} className={`${ctaGhost} mt-4`}>
                    RENEW
                  </button>
                  <p className="label-mono mt-5 text-[10px] text-gray-mid">UPDATE CHANNEL</p>
                  <div className="mt-2 flex gap-2">
                    {["stable", "daily"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        disabled={busy || channel === c}
                        onClick={() => renew(c)}
                        aria-pressed={channel === c}
                        className={`label-mono rounded-[2px] border px-3 py-1.5 text-[11px] ${
                          channel === c ? "border-accent text-accent" : "border-hairline text-gray-mid hover:text-fg"
                        }`}
                      >
                        {c.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <Link to="/pricing" className={`${ctaGhost} mt-6 inline-block`}>
                UNLOCK ANOTHER WORLD
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              <p className="label-mono text-xs text-gray-mid">NO WORLD CLAIMED YET</p>
              <Link to="/claim" className={`${ctaGhost} mt-4 inline-block`}>
                CLAIM A WORLD
              </Link>
            </div>
          )}
          <div className="mt-6 rounded-[2px] border border-hairline p-5">
            <p className="label-mono text-[10px] text-gray-mid">TEAM</p>
            <p className="mt-2 text-sm leading-[1.6] text-gray-lt">
              The free tier is one seat. Team invites unlock with a paid plan.
            </p>
            <Link to="/pricing" className={`${ctaGhost} mt-3 inline-block`}>
              SEE PLANS
            </Link>
          </div>
        </section>

        <section>
          <p className="label-mono text-xs text-gray-mid">PATCH NOTES</p>
          <div className="mt-4">
            {worldSlug ? (
              <>
                <PatchNotes world={worldSlug} surface="dashboard" />
                <Link to={`/worlds/${worldSlug}`} className="label-mono mt-3 inline-block text-[10px] text-gray-mid hover:text-fg">
                  PUBLIC MIRROR
                </Link>
              </>
            ) : (
              <p className="label-mono text-xs text-gray-mid">CLAIM A WORLD TO SEE ITS FEED</p>
            )}
          </div>
        </section>

        <section>
          <p className="label-mono text-xs text-gray-mid">REPORTS</p>
          <p className="label-mono mt-4 text-[10px] text-gray-mid">REPORT VERIFICATIONS</p>
          {verifications === null ? (
            <p className="label-mono mt-3 text-xs text-gray-mid">PENDING</p>
          ) : verifications.length === 0 ? (
            <p className="mt-3 text-sm leading-[1.6] text-gray-lt">
              Signed reports you generate will be verifiable here.
            </p>
          ) : (
            <div className="mt-3 divide-y divide-hairline border-y border-hairline">
              {verifications.map((v, i) => (
                <p key={i} className="py-2 font-mono text-xs text-gray-lt">
                  {v.tokenId.slice(0, 8)} · {new Date(v.at).toISOString().slice(0, 16).replace("T", " ")}
                </p>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function Dashboard() {
  if (!hasClerk) return <AuthPending />;
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <DashboardInner />
      </SignedIn>
    </>
  );
}
