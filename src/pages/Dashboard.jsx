import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  update,
  signOut,
  deleteAccount,
  useMockSession,
  issuePlaceholderKey,
  createApiKey,
  addSignedRecord,
} from "../lib/mock.js";
import { COPY_FLASH_MS } from "../data/ui.js";
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

const fmtDate = (ms) => new Date(ms).toISOString().slice(0, 10).replaceAll("-", ".");

function CopyBtn({ text, onCopy, className = "" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), COPY_FLASH_MS);
    });
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`label-mono shrink-0 text-xs ${copied ? "text-accent" : "text-gray-mid hover:text-fg"} ${className}`}
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}

// Signing lives entirely client side. Both paths hash locally and hand over
// only the digest; the record file itself is never transmitted anywhere.
function SignedRecords({ session }) {
  const keys = session.apiKeys || [];
  const records = session.records || [];
  const [selected, setSelected] = useState(keys[0]?.label || "default");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const command = `worlds sign ./record.json --key ${selected}`;

  const onFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    // WebCrypto digest of the file contents, computed in this browser. Only
    // the resulting hash is stored; no request carries the file.
    const buf = await file.arrayBuffer();
    const hashBuf = await crypto.subtle.digest("SHA-256", buf);
    const digest = [...new Uint8Array(hashBuf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    addSignedRecord({ digest, keyLabel: selected, name: file.name });
    track("record_signed", { path: "browser" });
  };

  return (
    <section className="border-t border-hairline py-8">
      <p className="label-mono text-xs text-gray-mid">SIGNED RECORDS</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="label-mono text-[10px] text-gray-mid">KEY</span>
        {keys.map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={() => setSelected(k.label)}
            aria-pressed={selected === k.label}
            className={`label-mono rounded-[2px] border px-3 py-1.5 text-[11px] ${
              selected === k.label
                ? "border-accent text-accent"
                : "border-hairline text-gray-mid hover:text-fg"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex max-w-2xl items-center justify-between gap-3 rounded-[2px] border border-hairline bg-[#0a0a0a] px-4 py-3">
        <code className="min-w-0 truncate font-mono text-sm text-gray-lt">{command}</code>
        <CopyBtn text={command} onCopy={() => track("sign_command_copied", {})} />
      </div>
      <p className="mt-2 max-w-[70ch] font-mono text-xs leading-relaxed tracking-[0.02em] text-gray-mid">
        The CLI canonicalizes the record, computes the digest locally, sends only the digest, and
        writes the returned signature back into the file.
      </p>

      <div
        role="button"
        tabIndex={0}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFiles(e.dataTransfer.files);
        }}
        className={`mt-6 flex max-w-2xl cursor-pointer items-center justify-center rounded-[2px] border border-dashed px-4 py-8 ${
          dragging ? "border-accent" : "border-hairline hover:border-gray-lt"
        }`}
      >
        <span className="label-mono text-xs text-gray-mid">
          DROP A RECORD HERE OR CLICK TO CHOOSE A FILE
        </span>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            onFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      <p className="mt-2 max-w-[70ch] text-sm leading-[1.6] text-gray-lt">
        Hashed in your browser. The file never leaves your machine. We sign the hash and never see
        the contents.
      </p>

      {records.length ? (
        <div className="mt-6 divide-y divide-hairline border-y border-hairline">
          <div className="hidden gap-4 py-2 sm:grid sm:grid-cols-[150px_100px_110px_110px_1fr]">
            {["DIGEST", "SIGNED", "KEY", "STATUS", ""].map((h, i) => (
              <span key={i} className="label-mono text-[10px] text-gray-mid">
                {h}
              </span>
            ))}
          </div>
          {records.map((r) => (
            <div
              key={r.digest}
              className="grid grid-cols-2 gap-2 py-3 font-mono text-xs sm:grid-cols-[150px_100px_110px_110px_1fr] sm:gap-4"
            >
              <span className="flex items-center gap-2 text-gray-lt">
                <span className="truncate">{r.digest.slice(0, 12)}</span>
                <CopyBtn text={r.digest} onCopy={() => track("record_digest_copied", {})} />
              </span>
              <span className="text-gray-mid">{fmtDate(r.signedAt)}</span>
              <span className="truncate text-gray-lt">{r.keyLabel}</span>
              <span className={r.status === "valid" ? "text-fg" : "text-gray-mid"}>
                {r.status === "valid" ? "Valid" : "Superseded"}
              </span>
              <Link
                to={`/verify/${r.digest}`}
                className="label-mono text-[10px] text-gray-mid hover:text-fg sm:text-right"
              >
                VERIFY
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="label-mono mt-6 text-xs text-gray-mid">
          Sign your first record to see it here.
        </p>
      )}
    </section>
  );
}

function ApiKeys({ session }) {
  const keys = session.apiKeys || [];
  const [label, setLabel] = useState("");
  const [revealed, setRevealed] = useState(null);

  const create = (e) => {
    e.preventDefault();
    const clean = label.trim().toLowerCase().replace(/\s+/g, "-");
    if (!clean || keys.some((k) => k.label === clean)) return;
    const token = createApiKey(clean);
    setRevealed({ label: clean, token });
    setLabel("");
    track("api_key_created", {});
  };

  return (
    <section className="border-t border-hairline py-8">
      <p className="label-mono text-xs text-gray-mid">API KEYS</p>
      <p className="mt-4 max-w-[70ch] text-sm leading-[1.6] text-gray-mid">
        One account, unlimited keys. Every signed record stores the label of the key that
        requested it, so attribution exists without user management.
      </p>

      <div className="mt-5 max-w-2xl divide-y divide-hairline border-y border-hairline">
        {keys.map((k) => (
          <div key={k.label} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 font-mono text-xs">
            <span className="truncate text-gray-lt">{k.label}</span>
            <span className="text-gray-mid">wrld_sk_····{k.last4}</span>
            <span className="text-gray-mid">{fmtDate(k.createdAt)}</span>
          </div>
        ))}
      </div>

      {revealed && (
        <div className="mt-4 max-w-2xl rounded-[2px] border border-hairline bg-[#0a0a0a] p-4">
          <p className="label-mono text-[10px] text-gray-mid">
            {revealed.label} · COPY IT NOW. IT WILL NOT BE SHOWN AGAIN.
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <code className="min-w-0 truncate font-mono text-sm text-gray-lt">{revealed.token}</code>
            <CopyBtn text={revealed.token} onCopy={() => track("key_copied", {})} />
          </div>
          <button
            type="button"
            onClick={() => setRevealed(null)}
            className="label-mono mt-3 text-[10px] text-gray-mid hover:text-fg"
          >
            DONE
          </button>
        </div>
      )}

      <form onSubmit={create} className="mt-4 flex max-w-2xl flex-wrap items-center gap-2">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="LABEL, E.G. CI-PROD"
          aria-label="New key label"
          className="min-w-0 flex-1 rounded-[2px] border border-hairline bg-bg px-3 py-1.5 font-mono text-xs tracking-[0.08em] placeholder:text-gray-mid"
        />
        <button type="submit" className="label-mono text-[10px] text-gray-lt hover:text-fg">
          CREATE KEY
        </button>
      </form>
    </section>
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

  return open ? (
    <form onSubmit={doDelete} className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
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
        className={`label-mono text-[10px] ${confirm === email ? "text-danger" : "text-gray-mid"}`}
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
      className="label-mono rounded-[2px] border border-danger px-4 py-2 text-xs text-danger hover:bg-danger hover:text-bg"
    >
      DELETE ACCOUNT
    </button>
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
      <div className="pb-8">
        <Micro>DASHBOARD</Micro>
        <p className="mt-2 font-mono text-sm tracking-[0.02em] text-gray-mid">{session.email}</p>
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

      <SignedRecords session={session} />
      <ApiKeys session={session} />

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
        <div className="mt-2 flex flex-wrap items-center gap-4 border-t border-hairline pt-6">
          <button type="button" onClick={out} className={ctaGhost}>
            SIGN OUT
          </button>
          <DeleteAccount email={session.email} />
        </div>
      </section>
    </main>
  );
}
