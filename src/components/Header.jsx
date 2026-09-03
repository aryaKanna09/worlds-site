import { Link } from "react-router-dom";
import spartaLogo from "../assets/sparta-logo.svg";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-bg">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2.5">
          {/* The wordmark's glyph baseline sits at 75% of the SVG height (the p
              descender fills the rest), so shift down 25% to share the text baseline. */}
          <img src={spartaLogo} alt="Sparta" className="h-[18px] w-auto translate-y-[25%]" />
          <span className="label-mono text-sm leading-none text-accent">WORLDS</span>
        </Link>
        <nav className="flex items-center gap-5">
          <Link to="/catalog" className="label-mono text-xs text-gray-mid hover:text-fg">
            CATALOG
          </Link>
          <Link to="/pricing" className="label-mono text-xs text-gray-mid hover:text-fg">
            PRICING
          </Link>
        </nav>
      </div>
    </header>
  );
}
