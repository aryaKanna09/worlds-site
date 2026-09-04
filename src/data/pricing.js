// Access is the product: one flat price per company, no usage billed.
export const tiers = [
  {
    key: "free",
    name: "FREE",
    price: "Free",
    cta: "GET STARTED FREE",
    signIn: true,
    description: "One world, full access, certification as a one time add on.",
    worldLimit: 1,
    features: [
      "Pick any one world from the catalog",
      "Full access to that world, all standard grading and diffing",
      "Certification not bundled: $300, paid once, when you want the signed report",
    ],
    note: "Certification available any time as a one time add on.",
  },
  {
    key: "startup",
    name: "STARTUP",
    price: "$350",
    per: "/mo",
    cta: "UPGRADE NOW",
    checkout: true,
    description: "Two worlds, unlimited runs, certification included.",
    worldLimit: 2,
    features: [
      "Two worlds, unlimited runs within them",
      "Certification included",
      "Up to three seats",
    ],
  },
  {
    key: "growth",
    name: "GROWTH",
    price: "$1,800",
    per: "/mo",
    cta: "UPGRADE NOW",
    checkout: true,
    description: "8 worlds, unlimited seats, certification included.",
    worldLimit: 8,
    features: [
      "8 worlds",
      "Unlimited seats",
      "Certification included",
      "Priority access to new world releases",
    ],
  },
  {
    key: "enterprise",
    name: "ENTERPRISE",
    price: "Custom",
    cta: "CHAT WITH OUR TEAM",
    href: "https://cal.com/usesparta",
    description:
      "Unlimited worlds and seats, custom SLA, custom worlds built to your stack if needed.",
    worldLimit: null,
    features: [
      "Unlimited worlds, unlimited seats",
      "Custom SLA",
      "Custom worlds built to your stack if needed",
      "Signed certification report, a compliance and procurement artifact",
    ],
  },
];

export const reportsNote =
  "Every certification report carries both grades, Completion and State Integrity, signed. Included on every paid tier, and a one time add on on Free.";
