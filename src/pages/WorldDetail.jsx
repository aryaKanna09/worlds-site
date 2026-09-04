import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getSession, update, useMockSession, issuePlaceholderKey } from "../lib/mock.js";
import { track } from "../lib/analytics.ts";
import { worlds } from "../data/worlds.js";
import WorldLogo from "../components/WorldLogo.jsx";
import { COPY_FLASH_MS } from "../data/ui.js";
import { Micro, ctaGhost } from "../components/ui.jsx";

const feeds = {};
for (const [path, mod] of Object.entries(import.meta.glob("../data/patchnotes/*.json", { eager: true }))) {
  feeds[path.split("/").pop().replace(".json", "")] = mod.default;
}

const P = () => <span className="text-gray-mid">PENDING</span>;

function CopyBlock({ display, copyText, onCopy }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(copyText ?? display).then(() => {
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), COPY_FLASH_MS);
    });
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-[2px] border border-hairline bg-[#0a0a0a] px-4 py-3">
      <code className="min-w-0 truncate font-mono text-sm text-gray-lt">{display}</code>
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

export default function WorldDetail() {
  const { slug } = useParams();
  const session = useMockSession();
  // The key is shown in full once, then masked on later visits.
  const [masked] = useState(() => Boolean(getSession()?.keySeen));

  const claim = session?.claim?.world === slug ? session.claim : null;
  const status = claim?.status === "active" ? "ACTIVE" : "PREPARING";

  useEffect(() => {
    if (claim) track("world_opened", { world: slug, status: claim.status });
  }, [slug]);

  useEffect(() => {
    if (claim?.status === "active" && session?.key) track("get_started_viewed", { world: slug });
  }, [slug, claim?.status]);

  useEffect(() => {
    if (session?.signedIn && session.key && !session.keySeen) update({ keySeen: true });
  }, [session?.key?.token]);

  useEffect(() => {
    track("patchnotes_viewed", { world: slug, surface: "dashboard" });
  }, [slug]);

  if (!session?.signedIn) return <Navigate to="/sign-in" replace />;
  if (!claim) return <Navigate to="/dashboard" replace />;

  const world = worlds.find((w) => w.id === slug);
  const key = session.key;
  const channel = key?.channel || "stable";
  const entries = feeds[slug] || [];
  const token = key ? (masked ? `${key.token.slice(0, 12)}············` : key.token) : null;

  const setChannel = (c) => {
    update({ key: issuePlaceholderKey(c), keySeen: true });
    track("channel_changed", { to: c });
    track("key_renewed", { tier: "free" });
  };

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Link to="/dashboard" className="label-mono text-[10px] text-gray-mid hover:text-fg">
        DASHBOARD
      </Link>
      <div className="mt-6 flex items-center gap-4">
        <WorldLogo domain={world?.domain} name={claim.name} sizeClass="h-10 w-10" />
        <h1 className="font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">{claim.name}</h1>
        <span className={`label-mono ml-auto text-[10px] ${status === "ACTIVE" ? "text-fg" : "text-gray-mid"}`}>
          {status}
        </span>
      </div>

      {claim.status === "active" ? (
        <section className="mt-10 rounded-[2px] border border-hairline p-6 sm:p-8">
          <Micro>GET STARTED</Micro>
          <div className="mt-4 max-w-2xl space-y-2">
            <CopyBlock
              display={`npx twinlab activate ${token}`}
              copyText={`npx twinlab activate ${key.token}`}
              onCopy={() => track("key_copied", {})}
            />
            <CopyBlock display="npx twinlab init" />
          </div>
          <p className="mt-4 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
            Everything else is generated. Two things are yours: confirm your agent reads the injected env
            vars, and write your business rules as assertions.
          </p>
        </section>
      ) : (
        <section className="mt-10 rounded-[2px] border border-hairline p-6 sm:p-8">
          <p className="max-w-[60ch] text-base leading-[1.6] text-gray-lt">
            Your {claim.name} world is being prepared. You'll get an email the moment it's ready.
          </p>
        </section>
      )}

      <section className="mt-10">
        <div className="flex flex-wrap items-center gap-4">
          <Micro>UPDATES</Micro>
          <div className="ml-auto flex items-center gap-2">
            <span className="label-mono text-[10px] text-gray-mid">CHANNEL</span>
            {["stable", "daily"].map((c) => (
              <button
                key={c}
                type="button"
                disabled={channel === c || claim.status !== "active"}
                onClick={() => setChannel(c)}
                aria-pressed={channel === c}
                className={`label-mono rounded-[2px] border px-3 py-1.5 text-[11px] ${
                  channel === c ? "border-accent text-accent" : "border-hairline text-gray-mid hover:text-fg"
                }`}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 max-w-[720px] font-mono text-xs leading-relaxed tracking-[0.02em] text-gray-mid">
          Real APIs change constantly. This world tracks those changes; your CI pins a version, so
          updates never move your results without you choosing.
        </p>
        <div className="mt-4 max-w-[720px] divide-y divide-hairline border-y border-hairline">
          {entries.length ? (
            entries.map((e, i) => (
              <p key={i} className="py-3 font-mono text-xs leading-relaxed tracking-[0.02em] text-gray-lt">
                {e.date ?? <P />} · {e.worldVersion ?? <P />} · {e.worldChange ?? <P />}
                {" · FIDELITY "}
                {e.fidelity ?? <P />}
              </p>
            ))
          ) : (
            <p className="label-mono py-3 text-xs text-gray-mid">NO FEED YET · PENDING</p>
          )}
        </div>
        <Link to={`/worlds/${slug}`} className="label-mono mt-3 inline-block text-[10px] text-gray-mid hover:text-fg">
          PUBLIC MIRROR
        </Link>
      </section>

      <Link to="/pricing" className={`${ctaGhost} mt-12 inline-block`}>
        UNLOCK ANOTHER WORLD
      </Link>
    </main>
  );
}
