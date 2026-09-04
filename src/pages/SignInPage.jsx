import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../lib/mock.js";
import { GitHubMark, GoogleMark, MicrosoftMark } from "../components/BrandMarks.jsx";
import { Micro, ctaPrimary } from "../components/ui.jsx";

const PROVIDERS = [
  ["github", "CONTINUE WITH GITHUB", GitHubMark],
  ["google", "CONTINUE WITH GOOGLE", GoogleMark],
  ["microsoft", "CONTINUE WITH MICROSOFT", MicrosoftMark],
];

// Mock sign in: every path signs into a placeholder session and lands on the
// dashboard. The one-time code step is a same-screen mock; any code works.
export default function SignInPage({ heading = "SIGN IN" }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("methods");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const finish = (provider) => {
    signIn(provider, email || undefined);
    navigate("/dashboard");
  };

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-[400px] rounded-[2px] border border-hairline bg-bg p-6 sm:p-8">
        <Micro>{heading}</Micro>
        <p className="mt-3 font-sans text-xl font-medium tracking-[-0.02em]">
          {heading === "SIGN IN" ? "Welcome back." : "Create your account."}
        </p>

        {step === "methods" ? (
          <>
            <div className="mt-6 space-y-2">
              {PROVIDERS.map(([key, label, Mark]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => finish(key)}
                  className="label-mono flex w-full items-center gap-3 rounded-[2px] border border-hairline px-4 py-2.5 text-xs whitespace-nowrap text-gray-lt hover:border-gray-lt hover:text-fg"
                >
                  <Mark />
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-[rgba(212,212,212,0.15)]" />
              <span className="label-mono text-[10px] text-gray-mid">OR</span>
              <span className="h-px flex-1 bg-[rgba(212,212,212,0.15)]" />
            </div>
            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setStep("code");
              }}
            >
              <label className="label-mono block text-[10px] text-gray-mid" htmlFor="signin-email">
                EMAIL
              </label>
              <input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOU@COMPANY.COM"
                className="mt-2 w-full rounded-[2px] border border-hairline bg-bg px-3 py-2 font-mono text-sm tracking-[0.08em] placeholder:text-gray-mid"
              />
              <button type="submit" className={`${ctaPrimary} mt-3 block w-full text-center`}>
                EMAIL ME A ONE-TIME CODE
              </button>
            </form>
          </>
        ) : (
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (code) finish("email");
            }}
          >
            <p className="text-sm leading-[1.6] text-gray-lt">
              We sent a code to <span className="font-mono text-fg">{email}</span>. Enter it below.
            </p>
            <label className="label-mono mt-4 block text-[10px] text-gray-mid" htmlFor="signin-code">
              CODE
            </label>
            <input
              id="signin-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              className="mt-2 w-full rounded-[2px] border border-hairline bg-bg px-3 py-2 font-mono text-sm tracking-[0.3em] placeholder:text-gray-mid"
            />
            <button type="submit" className={`${ctaPrimary} mt-3 block w-full text-center`}>
              VERIFY
            </button>
            <button
              type="button"
              onClick={() => setStep("methods")}
              className="label-mono mt-4 text-[10px] text-gray-mid hover:text-fg"
            >
              USE A DIFFERENT METHOD
            </button>
          </form>
        )}

        <p className="label-mono mt-6 text-[10px] text-gray-mid">NO PASSWORDS. ONE WORLD FREE.</p>
      </div>
    </main>
  );
}
