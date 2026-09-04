// Access is the product: flat per company, no seats billed, no usage billed.
export const tiers = [
  {
    key: "free",
    name: "FREE",
    price: "$0",
    cta: "START FREE",
    signIn: true,
    description: "One world, local runs, signed reports included.",
    worldLimit: 1,
  },
  {
    key: "team",
    name: "TEAM",
    price: "$400",
    per: "/mo",
    cta: "UPGRADE NOW",
    checkout: true,
    description: "Three worlds, daily updates, reports wired into CI.",
    worldLimit: 3,
  },
  {
    key: "growth",
    name: "GROWTH",
    price: "$2,000",
    per: "/mo",
    cta: "UPGRADE NOW",
    checkout: true,
    description: "Ten worlds and seed import at production scale.",
    worldLimit: 10,
  },
  {
    key: "enterprise",
    name: "ENTERPRISE",
    price: "Custom",
    cta: "UPGRADE NOW",
    checkout: true,
    description: "Every world, plus report evidence shaped to drop into the security reviews you already run.",
    worldLimit: null,
  },
];

// One row per capability, one column per tier, in tier order.
export const featureRows = [
  ["WORLDS", "1", "3", "10", "All, plus custom built"],
  ["UPDATE CHANNEL", "Stable", "Stable + daily", "Stable + daily", "Stable + daily + LTS"],
  [
    "ACTION ACCURACY REPORTS",
    "Two grades, signed",
    "Two grades, signed",
    "Two grades, signed",
    "Two grades, signed, shaped to drop into the security reviews you already run",
  ],
  ["SEATS", "One", "Unlimited", "Unlimited", "Unlimited"],
  ["SEED IMPORT", "One account", "One", "Multiple, production scale", "Unlimited"],
  ["FIDELITY SCORING OF YOUR ENVIRONMENT", "None", "None", "One", "Unlimited"],
  ["DEPLOYMENT", "Local + CI", "Local + CI", "Local + CI", "Shared VPC server"],
];

export const reportsNote =
  "Every report carries both grades, Completion and State Integrity, signed on every tier, the free one included.";
