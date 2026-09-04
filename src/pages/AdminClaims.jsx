import { Navigate } from "react-router-dom";
import { useMockSession } from "../lib/mock.js";
import { Micro } from "../components/ui.jsx";

// Mock build queue: shows this browser's provisioning claim, if any.
export default function AdminClaims() {
  const session = useMockSession();
  if (!session?.signedIn) return <Navigate to="/sign-in" replace />;

  const rows =
    session.claim?.status === "provisioning"
      ? [{ world: session.claim.world, count: 1, oldest: Date.now(), emails: [session.email] }]
      : [];

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>BUILD QUEUE</Micro>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
        Provisioning claims.
      </h1>
      <p className="label-mono mt-4 text-xs text-gray-mid">{rows.length} OPEN</p>
      <div className="mt-6 max-w-[720px] divide-y divide-hairline border-y border-hairline">
        {rows.map((q) => (
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
        {!rows.length && <p className="label-mono py-4 text-xs text-gray-mid">QUEUE EMPTY</p>}
      </div>
    </main>
  );
}
