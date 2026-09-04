import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, useMockSession } from "../lib/mock.js";
import { Micro, ctaGhost, ctaPrimary } from "../components/ui.jsx";

// Mock sign in: every path signs you into a placeholder session and issues a
// placeholder key, so the whole flow is walkable.
export default function SignInPage({ heading = "SIGN IN" }) {
  const navigate = useNavigate();
  const session = useMockSession();
  const [email, setEmail] = useState("");

  const go = (provider) => {
    const first = !session?.role;
    signIn(provider, email || undefined);
    navigate(first ? "/welcome" : "/dashboard");
  };

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>{heading}</Micro>
      <div className="mt-8 max-w-sm rounded-[2px] border border-hairline p-6 sm:p-8">
        <p className="font-sans text-xl font-medium tracking-[-0.02em]">
          {heading === "SIGN IN" ? "Welcome back." : "Create your account."}
        </p>
        <div className="mt-6 space-y-2">
          {["GITHUB", "GOOGLE", "MICROSOFT"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => go(p.toLowerCase())}
              className={`${ctaGhost} block w-full text-center`}
            >
              CONTINUE WITH {p}
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
            go("email");
          }}
        >
          <label className="label-mono block text-[10px] text-gray-mid" htmlFor="signin-email">
            EMAIL
          </label>
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOU@COMPANY.COM"
            className="mt-2 w-full rounded-[2px] border border-hairline bg-bg px-3 py-2 font-mono text-sm tracking-[0.08em] placeholder:text-gray-mid"
          />
          <button type="submit" className={`${ctaPrimary} mt-3 block w-full text-center`}>
            EMAIL ME A MAGIC LINK
          </button>
        </form>
        <p className="label-mono mt-6 text-[10px] text-gray-mid">
          NO PASSWORDS. ONE WORLD FREE.
        </p>
      </div>
    </main>
  );
}
