import { Link, Navigate } from "react-router-dom";
import { update, useMockSession, issuePlaceholderKey } from "../lib/mock.js";
import { track } from "../lib/analytics.ts";
import WorldLogo from "../components/WorldLogo.jsx";
import ClaimGrid from "../components/ClaimGrid.jsx";
import { worlds } from "../data/worlds.js";
import { Micro, ctaGhost } from "../components/ui.jsx";

export default function Dashboard() {
  const session = useMockSession();
  if (!session?.signedIn) return <Navigate to="/sign-in" replace />;

  const claim = session.claim;
  const world = claim ? worlds.find((w) => w.id === claim.world) : null;
  const key = session.key;

  const renew = () => {
    update({ key: issuePlaceholderKey(key?.channel || "stable"), keySeen: true });
    track("key_renewed", { tier: "free" });
  };

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>DASHBOARD</Micro>

      <section className="mt-8">
        <p className="label-mono text-xs text-gray-mid">YOUR WORLDS</p>
        {claim ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <article className="relative rounded-[2px] border border-hairline p-4 transition-[border-color] duration-150 hover:border-[rgba(212,212,212,0.4)]">
              <Link to={`/dashboard/worlds/${claim.world}`} className="block">
                <div className="flex items-center gap-3">
                  <WorldLogo domain={world?.domain} name={claim.name} />
                  <div className="min-w-0">
                    <h3 className="truncate font-sans text-base font-medium">{claim.name}</h3>
                    <p className="label-mono mt-0.5 text-[10px] text-gray-mid">{world?.domain}</p>
                  </div>
                  <span
                    className={`label-mono ml-auto text-[10px] ${
                      claim.status === "active" ? "text-fg" : "text-gray-mid"
                    }`}
                  >
                    {claim.status === "active" ? "ACTIVE" : "PREPARING"}
                  </span>
                </div>
              </Link>
              {key && (
                <p className="label-mono mt-3 text-[10px] text-gray-mid">
                  KEY EXPIRES {new Date(key.expiresAt).toISOString().slice(0, 10)}
                  <button type="button" onClick={renew} className="ml-3 text-gray-lt hover:text-fg">
                    RENEW
                  </button>
                </p>
              )}
            </article>
          </div>
        ) : (
          <p className="label-mono mt-4 text-xs text-gray-mid">NO WORLDS YET · CLAIM ONE BELOW</p>
        )}
      </section>

      <section className="mt-16">
        <p className="label-mono text-xs text-gray-mid">ALL WORLDS</p>
        <div className="mt-4">
          <ClaimGrid session={session} />
        </div>
      </section>
    </main>
  );
}
