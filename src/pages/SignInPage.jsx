import { SignIn } from "@clerk/clerk-react";
import { hasClerk, AuthPending } from "../lib/clerk.jsx";
import { Micro } from "../components/ui.jsx";

export default function SignInPage() {
  if (!hasClerk) return <AuthPending />;
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>SIGN IN</Micro>
      <div className="mt-8 flex justify-start">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </main>
  );
}
