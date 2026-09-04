import { useParams } from "react-router-dom";
import { useMockSession } from "../lib/mock.js";
import { Micro } from "../components/ui.jsx";

const fmtDate = (ms) => new Date(ms).toISOString().slice(0, 10).replaceAll("-", ".");

// Public verification page for a signed digest. The mockup checks the digest
// against records signed in this browser; nothing is fetched from anywhere.
export default function VerifyPage() {
  const { digest } = useParams();
  const session = useMockSession();
  const record = (session?.records || []).find((r) => r.digest === digest);

  return (
    <main className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>VERIFY</Micro>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em]">
        {record ? "This digest is signed." : "No signature found."}
      </h1>

      <div className="mt-8 rounded-[2px] border border-hairline p-6 font-mono text-sm leading-relaxed sm:p-8">
        <div className="grid grid-cols-[110px_1fr] gap-y-2">
          <span className="tracking-[0.08em] text-gray-mid">DIGEST</span>
          <span className="break-all text-gray-lt">{digest}</span>
          {record && (
            <>
              <span className="tracking-[0.08em] text-gray-mid">SIGNED</span>
              <span className="text-gray-lt">{fmtDate(record.signedAt)}</span>
              <span className="tracking-[0.08em] text-gray-mid">KEY</span>
              <span className="text-gray-lt">{record.keyLabel}</span>
              <span className="tracking-[0.08em] text-gray-mid">STATUS</span>
              <span className={record.status === "valid" ? "text-fg" : "text-gray-mid"}>
                {record.status === "valid" ? "Valid" : "Superseded"}
              </span>
            </>
          )}
        </div>
      </div>

      <p className="mt-6 max-w-[60ch] text-sm leading-[1.6] text-gray-mid">
        We sign a hash computed on the signer's machine, so this page can confirm a record was
        signed and has not been edited without ever seeing its contents.
      </p>
    </main>
  );
}
