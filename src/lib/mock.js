// Mock session store for the clickable mockup. Everything lives in
// localStorage; nothing here is real. The placeholder key is generated client
// side and is not a working credential.
import { useSyncExternalStore } from "react";

const STORAGE = "worlds_mock_session";
const listeners = new Set();

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE)) || null;
  } catch {
    return null;
  }
};

let state = read();

const save = (next) => {
  state = next;
  try {
    if (next === null) localStorage.removeItem(STORAGE);
    else localStorage.setItem(STORAGE, JSON.stringify(next));
  } catch {
    // Storage can be unavailable; the mockup still works for the session.
  }
  listeners.forEach((l) => l());
};

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const getSession = () => state;

export function useMockSession() {
  return useSyncExternalStore(subscribe, getSession);
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const randomChars = (n) => {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
};

// Placeholder key: looks like the real artifact, does nothing.
export const issuePlaceholderKey = (channel = "stable") => ({
  token: `wrld_sk_${randomChars(40)}`,
  tier: "free",
  channel,
  issuedAt: Date.now(),
  expiresAt: Date.now() + 30 * 86400 * 1000,
});

export const signIn = (provider, email) =>
  save({
    signedIn: true,
    provider,
    email: email || "you@company.com",
    name: state?.name || "",
    company: state?.company || "",
    claim: state?.claim || null,
    key: state?.key || issuePlaceholderKey(),
    keySeen: state?.keySeen || false,
    // Named API keys: one account, unlimited keys, labels supplied by the
    // user. Every account starts with one so the CLI command always renders.
    apiKeys: state?.apiKeys || [{ label: "default", last4: randomChars(4), createdAt: Date.now() }],
    records: state?.records || [],
  });

// Creates a named key and returns the full token. The token is shown once at
// creation and never stored in full; only the label and last four persist.
export const createApiKey = (label) => {
  const token = `wrld_sk_${randomChars(40)}`;
  const keys = [...(state?.apiKeys || []), { label, last4: token.slice(-4), createdAt: Date.now() }];
  save({ ...(state || {}), apiKeys: keys });
  return token;
};

// Records a signed digest. Only the digest ever reaches this store; the file
// contents are hashed in the browser and never transmitted. A new signature
// for the same file name supersedes earlier ones, standing in for the agent
// build or model version changing.
export const addSignedRecord = ({ digest, keyLabel, name }) => {
  const prior = (state?.records || []).map((r) =>
    r.name === name ? { ...r, status: "superseded" } : r
  );
  save({
    ...(state || {}),
    records: [{ digest, keyLabel, name, signedAt: Date.now(), status: "valid" }, ...prior],
  });
};

export const signOut = () => save(null);

// Full account wipe. In the functional build this calls the delete endpoint
// that revokes keys, deletes claims, and removes the auth user.
export const deleteAccount = () => save(null);

export const update = (patch) => save({ ...(state || {}), ...patch });

// Claims a world for the signed-in session; returns true when live (instant).
export const claimWorld = (world) => {
  const live = world.id === "stripe";
  save({
    ...(state || {}),
    claim: { world: world.id, name: world.name, status: live ? "active" : "provisioning" },
    ...(live ? { key: issuePlaceholderKey(state?.key?.channel || "stable"), keySeen: false } : {}),
  });
  return live;
};

// The signed-out CLAIM FREE path: remember the world through sign in.
const INTENT = "worlds_claim_intent";
export const setClaimIntent = (world) => {
  try {
    localStorage.setItem(INTENT, JSON.stringify({ id: world.id, name: world.name }));
  } catch {
    // Ignore; the user just lands on the dashboard instead.
  }
};
export const takeClaimIntent = () => {
  try {
    const raw = localStorage.getItem(INTENT);
    localStorage.removeItem(INTENT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
