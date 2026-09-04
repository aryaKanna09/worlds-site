import { Link, Navigate } from "react-router-dom";
import { update, useMockSession, issuePlaceholderKey } from "../lib/mock.js";
import { track } from "../lib/analytics.ts";
import PatchNotes from "../components/PatchNotes.jsx";
import { Micro, ctaGhost } from "../components/ui.jsx";

export default function Dashboard() {
  const session = useMockSession();
  if (!session?.signedIn) return <Navigate to="/sign-in" replace />;

  const key = session.key;
  const channel = key?.channel || "stable";
  const worldSlug = session.claim?.world;

  const renew = (nextChannel) => {
    update({ key: issuePlaceholderKey(nextChannel || channel), keySeen: true });
    if (nextChannel) track("channel_changed", { to: nextChannel });
    track("key_renewed", { tier: "free" });
  };

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>DASHBOARD</Micro>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section>
          <p className="label-mono text-xs text-gray-mid">YOUR WORLD</p>
          {session.claim ? (
            <div className="mt-4 rounded-[2px] border border-hairline p-5">
              <p className="font-sans text-lg font-medium">{session.claim.name}</p>
              <p className="label-mono mt-2 text-[10px] text-gray-mid">
                STATUS {session.claim.status.toUpperCase()}
              </p>
              {key && (
                <>
                  <p className="label-mono mt-1 text-[10px] text-gray-mid">
                    KEY EXPIRES {new Date(key.expiresAt).toISOString().slice(0, 10)}
                  </p>
                  <button type="button" onClick={() => renew()} className={`${ctaGhost} mt-4`}>
                    RENEW
                  </button>
                  <p className="label-mono mt-5 text-[10px] text-gray-mid">UPDATE CHANNEL</p>
                  <div className="mt-2 flex gap-2">
                    {["stable", "daily"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        disabled={channel === c}
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
                <Link
                  to={`/worlds/${worldSlug}`}
                  className="label-mono mt-3 inline-block text-[10px] text-gray-mid hover:text-fg"
                >
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
          <p className="mt-3 text-sm leading-[1.6] text-gray-lt">
            Signed reports you generate will be verifiable here.
          </p>
        </section>
      </div>
    </main>
  );
}
