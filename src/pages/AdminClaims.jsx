import { useEffect, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { apiFetch } from "../lib/api.js";
import { hasClerk, AuthPending } from "../lib/clerk.jsx";
import { Micro } from "../components/ui.jsx";

function AdminInner() {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch("/api/admin/claims", { getToken }).then(setData).catch((e) => setError(e.message));
  }, [getToken]);

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>BUILD QUEUE</Micro>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
        Provisioning claims.
      </h1>
      {error && <p className="label-mono mt-4 text-xs text-accent">{error.toUpperCase()}</p>}
      {data && (
        <>
          <p className="label-mono mt-4 text-xs text-gray-mid">{data.total} OPEN</p>
          <div className="mt-6 max-w-[720px] divide-y divide-hairline border-y border-hairline">
            {data.queue.map((q) => (
              <div key={q.world} className="py-4">
                <p className="font-mono text-sm text-fg">
                  {q.world} <span className="text-gray-mid">· {q.count}</span>
                </p>
                <p className="label-mono mt-1 text-[10px] text-gray-mid">
                  OLDEST {new Date(q.oldest).toISOString().slice(0, 10)}
                </p>
                <p className="mt-2 font-mono text-xs break-all text-gray-lt">{q.emails.join(", ")}</p>
              </div>
            ))}
            {!data.queue.length && <p className="label-mono py-4 text-xs text-gray-mid">QUEUE EMPTY</p>}
          </div>
        </>
      )}
    </main>
  );
}

export default function AdminClaims() {
  if (!hasClerk) return <AuthPending />;
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <AdminInner />
      </SignedIn>
    </>
  );
}
