// Install flow shown in the per-world install modal. Leads with the zero
// install npx door; the GitHub Action is the recommended default for CI;
// Docker and Python are secondary doors. Command strings are real shipped
// identifiers (package, image, action names are "twinlab", not the brand
// name) and must never be renamed to match the brand.

// Placeholder for the current published twinlab version. No published version
// value exists in this repo yet; update this at each release.
export const TWINLAB_VERSION = "0.2.0";

// Each step: [label, detail, command]. Details may mention the product name;
// the modal renders them through the Worlds treatment. A null detail renders
// nothing under the command.
export const installSteps = (name) => [
  [
    "TRY IT INSTANTLY, NO INSTALL",
    `Runs a live scripted demo against the ${name} twin. No install, no account.`,
    "npx twinlab demo",
  ],
  ["ADD IT TO YOUR OWN TEST SUITE", null, "npm i -D @twinlab/client"],
  [
    "RECOMMENDED FOR CI",
    "Starts automatically for the length of the job. No token, no cleanup.",
    `- uses: Sparta-AI/twinlab-setup@v1\n  with:\n    version: ${TWINLAB_VERSION}\n- run: npx vitest run twinlab/`,
  ],
  ["PREFER DOCKER", null, `docker run -d -p 4242:4242 ghcr.io/sparta-ai/twinlab:${TWINLAB_VERSION}`],
  ["PYTHON TEAM", null, "pip install twinlab-client"],
];
