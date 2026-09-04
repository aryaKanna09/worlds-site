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
    role: null,
    vertical: null,
    claim: null,
    key: issuePlaceholderKey(),
    keySeen: false,
  });

export const signOut = () => save(null);

export const update = (patch) => save({ ...(state || {}), ...patch });
