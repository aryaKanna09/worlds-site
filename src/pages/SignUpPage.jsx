import { SignUp } from "@clerk/clerk-react";
import { hasClerk, AuthPending } from "../lib/clerk.jsx";
import { Micro } from "../components/ui.jsx";

export default function SignUpPage() {
  if (!hasClerk) return <AuthPending />;
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>CREATE ACCOUNT</Micro>
      <div className="mt-8 flex justify-start">
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/welcome" />
      </div>
    </main>
  );
}
