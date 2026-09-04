// Access is the product: pay for environments, never for runs, seats, or
// signatures. Runs execute on the customer's infrastructure, so we cannot see
// them and do not meter them.
export const tiers = [
  {
    key: "free",
    name: "FREE",
    price: "Free",
    cta: "GET STARTED FREE",
    signIn: true,
    description: "Any one world from the catalog, your pick, fixed to your account.",
    worldLimit: 1,
    features: [
      "One world from the catalog, your pick, chosen once and fixed to your account",
      "Both grades and the full diff",
      "Signed records, free forever",
      "Public verification page",
      "Runs entirely on your machine",
    ],
  },
  {
    key: "team",
    name: "TEAM",
    price: "$400",
    per: "/mo",
    cta: "UPGRADE NOW",
    checkout: true,
    description: "Full catalog, worlds run together, State Integrity graded across systems.",
    worldLimit: null,
    features: [
      "Everything in Free",
      "Full world catalog",
      "Run worlds together in one environment, with State Integrity graded across systems",
      "Multi agent chain runs",
      "CI integration",
      "Named API keys",
      "Email support",
    ],
  },
  {
    key: "growth",
    name: "GROWTH",
    price: "$2,500",
    per: "/mo",
    cta: "UPGRADE NOW",
    checkout: true,
    description: "Everything in Team, one custom world per year, report API.",
    worldLimit: null,
    features: [
      "Everything in Team",
      "One custom world per year",
      "Priority access to new worlds",
      "Report API",
      "Shared Slack channel",
    ],
  },
  {
    key: "enterprise",
    name: "ENTERPRISE",
    price: "Custom",
    cta: "CHAT WITH OUR TEAM",
    href: "https://cal.com/usesparta",
    description: "Unlimited custom worlds, validation exports, SLA and dedicated support.",
    worldLimit: null,
    features: [
      "Everything in Growth",
      "Unlimited custom worlds",
      "Validation exports: IQ, OQ and PQ, EU AI Act Article 50, and control evidence for CMMC and SOC 2",
      "Alerting when a model version change supersedes a record",
      "SLA and dedicated support",
      "Twin engineering for your stack",
    ],
  },
];

// Lines under the tier grid. The first is why runs are never metered.
export const pricingNotes = [
  "Unlimited runs on every tier, the free one included. We do not meter runs because Worlds runs on your infrastructure and we never see them. Run as much as you want. We never see it.",
  "No seat counts. One account, unlimited named API keys with labels of your choosing, and every record notes the key that produced it, so attribution exists without user management.",
  "Signing is free on every tier and always will be. The signature proves the record was not edited. Reproducibility is what proves the claim.",
  "Records carry an expiry and are superseded when the agent build or model version changes. That is honesty about scope, not an upsell.",
];
