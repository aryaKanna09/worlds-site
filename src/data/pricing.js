// Flat per company. No seats, no usage billing. Tiers are framed around grading
// and reports, never world count. Only Enterprise books a demo; every other
// tier is self-serve.
export const tiers = [
  {
    name: "FREE",
    price: "$0",
    sub: "LOCAL, NO EXPORT",
    features: [
      "Grade in the Stripe world or your own environment",
      "Local only",
      "No report export",
    ],
    cta: "UPGRADE NOW",
    demo: false,
    ticks: false,
  },
  {
    name: "TEAM",
    price: "$400",
    per: "/mo",
    sub: "FLAT PER COMPANY",
    features: ["Signed Action Accuracy Reports", "pass^k in CI", "All worlds in the catalog"],
    cta: "UPGRADE NOW",
    demo: false,
    ticks: true,
  },
  {
    name: "GROWTH",
    price: "$2,000",
    per: "/mo",
    sub: "FLAT PER COMPANY",
    features: [
      "Fidelity scoring of one customer-supplied environment",
      "Custom seeds from imported data",
      "Early access to new worlds",
    ],
    cta: "UPGRADE NOW",
    demo: false,
    ticks: true,
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    sub: "ANNUAL",
    features: [
      "Self-hosted license",
      "Fidelity scoring of unlimited environments",
      "A world built to your system",
      "Signed reports with audit trail",
    ],
    cta: "BOOK A DEMO",
    demo: true,
    ticks: false,
  },
];
