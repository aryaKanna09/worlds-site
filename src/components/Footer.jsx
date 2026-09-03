import Definition from "./Definition.jsx";
import { COPYRIGHT_YEAR } from "../data/ui.js";

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto max-w-[1120px] px-4 pt-24 pb-16 sm:px-6">
        <Definition />
        <p className="mt-10 px-6 font-mono text-[11px] tracking-[0.08em] text-gray-mid sm:px-8">
          © {COPYRIGHT_YEAR} SPARTA ·{" "}
          <a href="https://usesparta.co" target="_blank" rel="noreferrer" className="hover:text-fg">
            USESPARTA.CO
          </a>{" "}
          ·{" "}
          <a href="mailto:arya@usesparta.co" className="hover:text-fg">
            ARYA@USESPARTA.CO
          </a>
        </p>
      </div>
    </footer>
  );
}
