// All 16 walkthrough sessions, keyed "{agent}:{condition}". Loaded eagerly so
// switching is instant and there are no empty states.
const modules = import.meta.glob("./*.json", { eager: true });

export const AGENTS = [
  { key: "invoice", label: "INVOICE AGENT", system: "STRIPE" },
  { key: "offboarding", label: "OFFBOARDING AGENT", system: "OKTA" },
  { key: "quoting", label: "QUOTING AGENT", system: "SALESFORCE" },
  { key: "claims", label: "CLAIMS AGENT", system: "GUIDEWIRE" },
];

export const CONDITIONS = [
  { key: "clean", label: "CLEAN" },
  { key: "rate-limits", label: "RATE LIMITS" },
  { key: "outages", label: "OUTAGES" },
  { key: "webhook-chaos", label: "WEBHOOK CHAOS" },
];

export const sessions = {};
for (const [path, mod] of Object.entries(modules)) {
  const name = path.replace("./", "").replace(".json", "");
  const [agent, condition] = [name.slice(0, name.indexOf("_")), name.slice(name.indexOf("_") + 1)];
  sessions[`${agent}:${condition}`] = mod.default;
}

export const getSession = (agent, condition) => sessions[`${agent}:${condition}`];
