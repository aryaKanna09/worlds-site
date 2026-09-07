import { Micro } from "../components/ui.jsx";

// Route stub only. No documentation site or public repo exists yet; the nav
// item lands here until one does. Do not fill this with invented content.
export default function DocsPage() {
  return (
    <main className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 md:py-24">
      <Micro>DOCS</Micro>
      <h1 className="mt-3 font-sans text-2xl font-medium tracking-[-0.02em]">
        Documentation is on its way.
      </h1>
      <p className="label-mono mt-6 text-xs text-gray-mid">
        PENDING · <a href="mailto:arya@usesparta.co" className="text-gray-lt hover:text-fg">ASK US ANYTHING MEANWHILE</a>
      </p>
    </main>
  );
}
