// Setup walkthrough shown in the install modal. Placeholder steps; the pip
// command for the world renders below the steps in the modal.
export const installSteps = (name) => [
  ["CREATE AN ACCOUNT", "Sign up and copy your API key from the dashboard."],
  ["INSTALL THE PACKAGE", "Run the pip command below."],
  [
    "POINT YOUR AGENT",
    `Set your agent's base URL to the ${name} world. Same URLs, same errors, same rules.`,
  ],
  ["RUN A GRADED SESSION", "Run once, read the diff, get your Action Accuracy."],
];
