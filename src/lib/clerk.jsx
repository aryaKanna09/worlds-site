import { ClerkProvider } from "@clerk/clerk-react";
import { Micro } from "../components/ui.jsx";

export const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const hasClerk = Boolean(CLERK_KEY);

// Clerk restyled to the brand: black, hairlines, mono labels, 2px radii.
const appearance = {
  variables: {
    colorPrimary: "#FF5A12",
    colorBackground: "#000000",
    colorInputBackground: "#0a0a0a",
    colorText: "#ffffff",
    colorTextSecondary: "#7A7F7F",
    colorInputText: "#D4D4D4",
    borderRadius: "2px",
    fontFamily: '"Space Grotesk", sans-serif',
  },
  elements: {
    card: { background: "#000000", border: "1px solid rgba(212,212,212,0.15)", boxShadow: "none" },
    headerTitle: { fontFamily: '"Space Grotesk", sans-serif' },
    socialButtonsBlockButton: {
      background: "transparent",
      border: "1px solid rgba(212,212,212,0.15)",
      color: "#ffffff",
    },
    formFieldLabel: {
      fontFamily: '"Space Mono", monospace',
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontSize: "11px",
    },
    footer: { background: "transparent" },
  },
};

export function MaybeClerkProvider({ children }) {
  if (!hasClerk) return children;
  return (
    <ClerkProvider publishableKey={CLERK_KEY} appearance={appearance} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  );
}

// Rendered wherever auth is required but Clerk is not configured yet.
export function AuthPending() {
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>ACCOUNT</Micro>
      <p className="label-mono mt-6 text-sm text-gray-mid">AUTH NOT CONFIGURED · PENDING</p>
      <p className="mt-4 max-w-[60ch] text-base leading-[1.6] text-gray-lt">
        Set VITE_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY, then reload. DEPLOY.md has the exact
        steps.
      </p>
    </main>
  );
}
