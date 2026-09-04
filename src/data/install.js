// Setup walkthrough shown in the install modal. The pip command for the world
// renders below the steps in the modal. Details may mention the product name;
// the modal renders them through the Worlds treatment.
export const installSteps = (name) => [
  ["CREATE AN ACCOUNT", "Sign up and copy your API key from the dashboard."],
  [
    "INSTALL THE PACKAGE",
    "Run the pip command below. It installs as a fixture next to the tests you already have; keep your harness.",
  ],
  [
    "POINT YOUR AGENT",
    `Set your agent's base URL to the ${name} world. Same URLs, same errors, same rules.`,
  ],
  [
    "RUN A GRADED SESSION",
    "Run once inside your existing suite. Worlds supplies the world, grades Completion and State Integrity across the whole run, and signs the result.",
  ],
];
