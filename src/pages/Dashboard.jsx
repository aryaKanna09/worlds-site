import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { update, signOut, deleteAccount, useMockSession, issuePlaceholderKey } from "../lib/mock.js";
import { track } from "../lib/analytics.ts";
import { tiers } from "../data/pricing.js";
import { worlds } from "../data/worlds.js";
import WorldLogo from "../components/WorldLogo.jsx";
import { Micro, ctaGhost } from "../components/ui.jsx";

const SEVEN_DAYS_MS = 7 * 86400 * 1000;

function Row({ label, value, onSave, verify }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("edit");

  const start = () => {
    setDraft(value || "");
    setStep("edit");
    setCode("");
    setEditing(true);
  };

  const submit = (e) => {
    e.preventDefault();
    if (verify && step === "edit") {
      setStep("code");
      return;
    }
    onSave(draft);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-6">
      <span className="label-mono w-28 shrink-0 text-[10px] text-gray-mid">{label}</span>
      {editing ? (
        <form onSubmit={submit} className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {step === "edit" ? (
            <input
              type={verify ? "email" : "text"}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              className="min-w-0 flex-1 rounded-[2px] border border-hairline bg-bg px-3 py-1.5 font-mono text-sm tracking-[0.02em]"
            />
          ) : (
            <>
              <span className="label-mono text-[10px] text-gray-mid">CODE SENT TO {draft}</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                autoFocus
                className="w-28 rounded-[2px] border border-hairline bg-bg px-3 py-1.5 font-mono text-sm tracking-[0.3em] placeholder:text-gray-mid"
              />
            </>
          )}
          <button type="submit" className="label-mono text-[10px] text-gray-lt hover:text-fg">
            {verify && step === "edit" ? "SEND CODE" : "SAVE"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="label-mono text-[10px] text-gray-mid hover:text-fg"
          >
            CANCEL
          </button>
        </form>
      ) : (
        <>
          <span className="min-w-0 flex-1 truncate font-mono text-sm text-gray-lt">
            {value || <span className="text-gray-mid">NOT SET</span>}
          </span>
          <button type="button" onClick={start} className="label-mono text-[10px] text-gray-mid hover:text-fg">
            EDIT
          </button>
        </>
      )}
    </div>
  );
}

function DeleteAccount({ email }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");

  const doDelete = (e) => {
    e.preventDefault();
    if (confirm !== email) return;
    deleteAccount();
    window.location.assign("/");
  };

  return (
    <div className="pt-6">
      {open ? (
        <form onSubmit={doDelete} className="flex flex-wrap items-center gap-2">
          <span className="label-mono text-[10px] text-gray-mid">TYPE {email} TO CONFIRM</span>
          <input
            type="text"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoFocus
            className="min-w-0 flex-1 rounded-[2px] border border-hairline bg-bg px-3 py-1.5 font-mono text-xs tracking-[0.02em]"
          />
          <button
            type="submit"
            disabled={confirm !== email}
            className={`label-mono text-[10px] ${confirm === email ? "text-accent" : "text-gray-mid"}`}
          >
            DELETE
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="label-mono text-[10px] text-gray-mid hover:text-fg"
          >
            CANCEL
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="label-mono text-[10px] text-gray-mid hover:text-fg"
        >
          DELETE ACCOUNT
        </button>
      )}
    </div>
  );
}

export default function Dashboard() {
  const session = useMockSession();
  const tier = tiers.find((t) => t.key === (session?.key?.tier || "free")) || tiers[0];

  useEffect(() => {
    if (session?.signedIn) track("plan_viewed", { tier: tier.key });
  }, [session?.signedIn, tier.key]);

  if (!session?.signedIn) return <Navigate to="/sign-in" replace />;

  const claim = session.claim;
  const world = claim ? worlds.find((w) => w.id === claim.world) : null;
  const key = session.key;
  const claimedCount = claim ? 1 : 0;
  const expiresSoon = key && key.expiresAt - Date.now() < SEVEN_DAYS_MS;
  const limitLabel = tier.worldLimit === null ? "ALL" : tier.worldLimit;
  const paid = tier.key !== "free";

  const renew = () => {
    update({ key: issuePlaceholderKey(key?.channel || "stable"), keySeen: true });
    track("key_renewed", { tier: tier.key });
  };

  const out = () => {
    track("sign_out_clicked", {});
    // Hard navigation: router navigations are transitions, so the store wipe's
    // synchronous re-render would let the auth guard redirect to /sign-in first.
    signOut();
    window.location.assign("/");
  };

  const saveField = (field, value) => {
    update({ [field]: value });
    track("account_updated", { field });
  };

  return (
    <main className="mx-auto max-w-[960px] px-4 py-16 sm:px-6 md:py-24">
      <div className="flex items-center justify-between pb-8">
        <div>
          <Micro>DASHBOARD</Micro>
          <p className="mt-2 font-mono text-sm tracking-[0.02em] text-gray-mid">{session.email}</p>
        </div>
        <button type="button" onClick={out} className={ctaGhost}>
          SIGN OUT
        </button>
      </div>

      <section className="border-t border-hairline py-8">
        <div className="flex items-center justify-between">
          <p className="label-mono text-xs text-gray-mid">YOUR WORLDS</p>
          <Link
            to="/catalog"
            onClick={() => track("find_more_worlds_clicked", {})}
            className={ctaGhost}
          >
            FIND MORE WORLDS
          </Link>
        </div>
        {claim ? (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <article className="relative rounded-[2px] border border-hairline p-4 transition-[border-color] duration-150 hover:border-[rgba(212,212,212,0.4)]">
              <Link to={`/dashboard/worlds/${claim.world}`} className="flex items-center gap-3">
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
              </Link>
            </article>
          </div>
        ) : (
          <p className="label-mono mt-6 text-xs text-gray-mid">NO WORLDS YET</p>
        )}
      </section>

      <section className="border-t border-hairline py-8">
        <p className="label-mono text-xs text-gray-mid">YOUR PLAN</p>
        <p className="mt-4 font-sans text-3xl font-medium tracking-[-0.02em]">{tier.name}</p>
        <p className="mt-2 max-w-[60ch] text-base leading-[1.6] text-gray-mid">{tier.description}</p>
        {key && (
          <p className="label-mono mt-5 text-[10px] text-gray-mid">
            KEY EXPIRES{" "}
            <span className={expiresSoon ? "text-accent" : undefined}>
              {new Date(key.expiresAt).toISOString().slice(0, 10)}
            </span>
            <button type="button" onClick={renew} className="ml-3 text-gray-lt hover:text-fg">
              RENEW
            </button>
          </p>
        )}
        <p className="label-mono mt-2 text-[10px] text-gray-mid">
          {claimedCount} OF {limitLabel} WORLDS CLAIMED
        </p>
        {paid ? (
          <a href="#account" className={`${ctaGhost} mt-6 inline-block`}>
            MANAGE PLAN
          </a>
        ) : (
          <Link to="/pricing" className={`${ctaGhost} mt-6 inline-block`}>
            UPGRADE
          </Link>
        )}
      </section>

      <section id="account" className="border-t border-hairline py-8">
        <p className="label-mono text-xs text-gray-mid">ACCOUNT</p>
        <div className="mt-2 divide-y divide-hairline">
          <Row label="NAME" value={session.name} onSave={(v) => saveField("name", v)} />
          <Row label="EMAIL" value={session.email} verify onSave={(v) => saveField("email", v)} />
          <Row label="COMPANY" value={session.company} onSave={(v) => saveField("company", v)} />
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-6">
            <span className="label-mono w-28 shrink-0 text-[10px] text-gray-mid">BILLING</span>
            <span className="min-w-0 flex-1 font-mono text-sm text-gray-mid">
              No payment method on file
            </span>
            <a
              href="https://cal.com/usesparta"
              target="_blank"
              rel="noreferrer"
              className="label-mono text-[10px] text-gray-mid hover:text-fg"
            >
              SET UP BILLING
            </a>
          </div>
        </div>
        <DeleteAccount email={session.email} />
      </section>
    </main>
  );
}
