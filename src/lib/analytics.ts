// PostHog wrapper: explicit typed events only, no autocapture, Do Not Track
// respected. Missing key means every call is a no op.
import posthog from "posthog-js";

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || "https://us.i.posthog.com";

let ready = false;

export function initAnalytics(): void {
  if (ready || !KEY) return;
  const dnt =
    typeof navigator !== "undefined" &&
    (navigator.doNotTrack === "1" || (window as { doNotTrack?: string }).doNotTrack === "1");
  if (dnt) return;
  posthog.init(KEY, {
    api_host: HOST,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
  });
  ready = true;
}

type Events = {
  walkthrough_replayed: { agent: string; condition: string; mode: "session" | "fleet" };
  walkthrough_fail_seen: { agent: string; condition: string };
  cta_test_your_agent_clicked: { source: "walkthrough" | "hero" | "overview" };
  signup_completed: { provider: string };
  role_answered: { role: string | null; vertical: string | null };
  world_claimed: { world: string; live: boolean };
  provisioning_shown: { world: string };
  key_issued: { tier: string };
  key_renewed: { tier: string };
  start_door_opened: { door: "demo" | "wire" };
  key_copied: Record<string, never>;
  invite_engineer_sent: Record<string, never>;
  patchnotes_viewed: { world: string; surface: "dashboard" | "public" };
  channel_changed: { to: string };
  pricing_viewed: Record<string, never>;
  upgrade_clicked: { tier: string };
};

export function track<K extends keyof Events>(event: K, props: Events[K]): void {
  if (!ready) return;
  posthog.capture(event, props as Record<string, unknown>);
}

export function identify(accountId: string, personProps?: Record<string, unknown>): void {
  if (!ready) return;
  posthog.identify(accountId, personProps);
}
